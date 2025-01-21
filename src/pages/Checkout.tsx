import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { LoginPrompt } from "@/components/checkout/LoginPrompt";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { 
  CANADIAN_TAX_RATES, 
  US_TAX_RATES, 
  SHIPPING_OPTIONS,
  USD_TO_CAD,
} from "@/utils/locationData";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { ShippingOptions } from "@/components/checkout/ShippingOptions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { sendOrderEmails } from "@/utils/emailService";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, activePromoCode, clearCart } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
      if (data.country) setCountry(data.country);
      if (data.region) setRegion(data.region);
      if (data.phone_number) setPhoneNumber(data.phone_number);
    }
  };

  const updateProfile = async (field: string, value: string) => {
    if (!user) return;

    const updates = {
      id: user.id,
      [field]: value,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const calculateTaxes = () => {
    if (!region) return { gst: 0, pst: 0, hst: 0 };
    
    const taxRates = country === "CA" 
      ? CANADIAN_TAX_RATES[region] 
      : US_TAX_RATES[region] || { pst: 0 };
    
    return {
      gst: taxRates.gst || 0,
      pst: taxRates.pst || 0,
      hst: taxRates.hst || 0
    };
  };

  const shippingOptions = country ? SHIPPING_OPTIONS[country] : [];
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);

  const taxes = calculateTaxes();
  const subtotalInCurrentCurrency = country === "US" ? subtotal / USD_TO_CAD : subtotal;
  const shippingCost = selectedShippingOption?.price || 0;
  
  const taxAmount = subtotalInCurrentCurrency * (
    (taxes.hst || 0) / 100 +
    (taxes.gst || 0) / 100 +
    (taxes.pst || 0) / 100
  );

  const total = subtotalInCurrentCurrency + taxAmount + shippingCost;
  const currencySymbol = country === "US" ? "$" : "CAD $";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShipping) {
      toast.error("Please select a shipping method");
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const customerDetails = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: phoneNumber,
      address: formData.get('address') as string,
      country,
      region
    };

    // If user is logged in, update their profile
    if (user) {
      const fullName = `${customerDetails.firstName} ${customerDetails.lastName}`;
      await updateProfile('full_name', fullName);
      await updateProfile('phone_number', customerDetails.phone);
      await updateProfile('address', customerDetails.address);
      await updateProfile('country', customerDetails.country);
      await updateProfile('region', customerDetails.region);
    }
    
    const orderDetails = {
      items,
      subtotal: subtotalInCurrentCurrency,
      taxes,
      shipping: selectedShippingOption,
      total,
      currency: country === "US" ? "USD" : "CAD",
      customerDetails
    };

    try {
      // Save order to Supabase if user is logged in
      if (user) {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            order_number: Math.random().toString(36).substr(2, 9).toUpperCase(),
            total_amount: total,
            status: 'pending',
            items: items,
            shipping_address: {
              address: customerDetails.address,
              country: customerDetails.country,
              region: customerDetails.region,
              phone: customerDetails.phone
            },
            billing_address: {
              address: customerDetails.address,
              country: customerDetails.country,
              region: customerDetails.region,
              phone: customerDetails.phone
            }
          });

        if (orderError) {
          console.error('Error saving order:', orderError);
          throw new Error('Failed to save order');
        }
      }

      await sendOrderEmails({
        customerEmail: customerDetails.email,
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        items,
        total,
        shippingAddress: {
          address: customerDetails.address,
          region: customerDetails.region,
          country: customerDetails.country
        }
      });

      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow container max-w-4xl mx-auto px-4 py-8 mt-20">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8 mt-20">
        <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
        
        <LoginPrompt />
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-2 md:order-1"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <CustomerForm
                country={country}
                setCountry={setCountry}
                region={region}
                setRegion={setRegion}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                profile={profile}
                onFormChange={updateProfile}
              />

              {country && (
                <ShippingOptions
                  shippingOptions={SHIPPING_OPTIONS[country] || []}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                  currencySymbol={country === "US" ? "$" : "CAD $"}
                />
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !country || !region || !selectedShipping}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <OrderSummary
              items={items}
              subtotalInCurrentCurrency={subtotalInCurrentCurrency}
              currencySymbol={currencySymbol}
              taxes={taxes}
              selectedShippingOption={selectedShippingOption}
              total={total}
              activePromoCode={activePromoCode}
            />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;