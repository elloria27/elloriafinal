import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { LoginPrompt } from "@/components/checkout/LoginPrompt";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { ShippingOptions } from "@/components/checkout/ShippingOptions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { StripeCheckout } from "@/components/checkout/StripeCheckout";
import { sendOrderEmails } from "@/utils/emailService";
import { supabase } from "@/integrations/supabase/client";
import { 
  CANADIAN_TAX_RATES, 
  US_TAX_RATES,
  USD_TO_CAD 
} from "@/utils/locationData";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, activePromoCode, clearCart, calculateDiscount } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any>(null);
  const [deliveryMethods, setDeliveryMethods] = useState<any[]>([]);

  useEffect(() => {
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

    // Fetch payment methods configuration
    fetchPaymentMethods();
    // Fetch delivery methods
    fetchDeliveryMethods();

    return () => subscription.unsubscribe();
  }, []);

  const fetchDeliveryMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true });

      if (error) throw error;

      console.log('Fetched delivery methods:', data);
      setDeliveryMethods(data || []);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
      toast.error('Failed to load delivery methods');
    }
  };

  const fetchPaymentMethods = async () => {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('payment_methods')
      .single();

    if (error) {
      console.error('Error fetching payment methods:', error);
      return;
    }

    if (data) {
      console.log('Payment methods fetched:', data.payment_methods);
      setPaymentMethods(data.payment_methods);
    }
  };

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      console.log('Profile fetched successfully:', data);
      setProfile(data);
      if (data.country) setCountry(data.country);
      if (data.region) setRegion(data.region);
      if (data.phone_number) setPhoneNumber(data.phone_number);
    }
  };

  const updateProfile = async (field: string, value: string) => {
    if (!user) return;

    console.log('Updating profile field:', field, 'with value:', value);
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
    } else {
      console.log('Profile updated successfully');
    }
  };

  const calculateTaxes = () => {
    if (!region) return { gst: 0, pst: 0, hst: 0 };
    
    const taxRates = country === "CA" 
      ? CANADIAN_TAX_RATES[region] 
      : US_TAX_RATES[region] || { gst: 5 }; // Default to 5% GST for Canadian regions
    
    return {
      gst: taxRates.gst || 0,
      pst: 0, // We're only using GST now
      hst: 0  // We're only using GST now
    };
  };

  const shippingOptions = deliveryMethods.map(method => ({
    id: method.id,
    name: method.name,
    price: method.base_price,
    estimatedDays: method.estimated_days,
    currency: country === "US" ? "USD" : "CAD"
  }));

  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);

  const taxes = calculateTaxes();
  const subtotalInCurrentCurrency = country === "US" ? subtotal / USD_TO_CAD : subtotal;
  const shippingCost = selectedShippingOption?.price || 0;
  
  // Calculate discount only on items, not shipping
  const discountAmount = activePromoCode ? calculateDiscount(activePromoCode, subtotalInCurrentCurrency) : 0;
  const subtotalAfterDiscount = Math.max(0, subtotalInCurrentCurrency - discountAmount);
  
  const taxAmount = subtotalAfterDiscount * (
    (taxes.hst || 0) / 100 +
    (taxes.gst || 0) / 100 +
    (taxes.pst || 0) / 100
  );

  const total = subtotalAfterDiscount + taxAmount + shippingCost;
  const currencySymbol = country === "US" ? "$" : "CAD $";

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log('Starting order submission process');

  if (!selectedShipping) {
    toast.error("Please select a shipping method");
    return;
  }

  // If Stripe is enabled and selected as the payment method, don't process the order here
  if (paymentMethods?.stripe) {
    return;
  }
  
  setIsSubmitting(true);
  
  try {
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

    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email || 
        !customerDetails.phone || !customerDetails.address || !country || !region) {
      toast.error("Please fill in all required fields");
      return;
    }

    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    console.log('Generated order number:', orderNumber);

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Prepare order data
    const orderData = {
      user_id: userId || null,
      profile_id: userId || null,
      order_number: orderNumber,
      total_amount: total,
      status: 'pending',
      items: items,
      shipping_address: {
        address: customerDetails.address,
        country: customerDetails.country,
        region: customerDetails.region,
        phone: customerDetails.phone,
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email
      },
      billing_address: {
        address: customerDetails.address,
        country: customerDetails.country,
        region: customerDetails.region,
        phone: customerDetails.phone,
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email
      },
      payment_method: 'cash_on_delivery',
      applied_promo_code: activePromoCode
    };

    console.log('Saving order to database:', orderData);

    // Save order to Supabase
    const { error: orderError } = await supabase
      .from('orders')
      .insert(orderData);

    if (orderError) {
      console.error('Error saving order:', orderError);
      throw new Error('Failed to save order');
    }

    console.log('Order saved successfully');

    // Send order confirmation email
    console.log('Sending order confirmation email');
    const emailResult = await sendOrderEmails({
      customerEmail: customerDetails.email,
      customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
      orderId: orderNumber,
      items,
      total,
      shippingAddress: {
        address: customerDetails.address,
        region: customerDetails.region,
        country: customerDetails.country
      }
    });

    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      toast.error('Order placed but confirmation email failed to send');
    } else {
      console.log('Email sent successfully');
    }

    clearCart();
    navigate("/order-success");

  } catch (error: any) {
    console.error('Error processing order:', error);
    toast.error(error.message || "There was an error processing your order. Please try again.");
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

              {country && shippingOptions.length > 0 && (
                <ShippingOptions
                  shippingOptions={shippingOptions}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                  currencySymbol={currencySymbol}
                />
              )}

              {paymentMethods?.stripe ? (
                <StripeCheckout
                  total={total}
                  subtotal={subtotalAfterDiscount}
                  taxes={taxes}
                  shippingAddress={{ country, region }}
                  shippingCost={shippingCost}
                />
              ) : (
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !country || !region || !selectedShipping}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              )}
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
    </div>
  );
};

export default Checkout;
