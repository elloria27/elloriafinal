
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { LoginPrompt } from "@/components/checkout/LoginPrompt";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { ShippingOptions } from "@/components/checkout/ShippingOptions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { apiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CANADIAN_TAX_RATES, 
  US_TAX_RATES, 
  USD_TO_CAD 
} from "@/utils/locationData";
import { StripeCheckout } from "@/components/checkout/StripeCheckout";
import { ShippingOption } from "@/utils/locationData";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, activePromoCode, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [availableShippingMethods, setAvailableShippingMethods] = useState<ShippingOption[]>([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    country: '',
    region: '',
    phone: '',
    first_name: '',
    last_name: '',
    email: '',
    full_name: ''
  });

  // Fetch initial user data and profile
  useEffect(() => {
    const initializeCheckout = async () => {
      if (user) {
        try {
          // Здесь мы бы получили профиль пользователя через API
          // Для демонстрации используем данные из пользователя
          const profileData = {
            id: user.id,
            full_name: user.full_name || '',
            email: user.email
          };
            
          if (profileData) {
            console.log('Checkout - Profile loaded:', profileData);
            setProfile(profileData);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    initializeCheckout();
    fetchPaymentMethods();
  }, [user]);

  // Fetch payment methods (пример как мы можем получить платежные методы через API)
  const fetchPaymentMethods = async () => {
    try {
      // Имитируем получение платежных методов
      // В реальном приложении это был бы запрос к API
      const mockPaymentMethods = [
        {
          id: 'stripe',
          name: 'Credit / Debit Card',
          description: 'Pay securely with Visa, Mastercard, or American Express',
          icon_url: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/credit-card-icon.png',
          is_active: true
        },
        {
          id: 'paypal',
          name: 'PayPal',
          description: 'Pay using your PayPal account',
          icon_url: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/paypal-icon.png',
          is_active: true
        }
      ];

      console.log('Checkout - Payment methods loaded:', mockPaymentMethods);
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    console.log(`Checkout - handleFormChange - ${field}:`, value);
    
    setShippingAddress(prev => {
      const updated = { ...prev, [field]: value };
      
      // Handle special cases
      if (field === 'first_name' || field === 'last_name') {
        updated.full_name = `${updated.first_name} ${updated.last_name}`.trim();
      }
      
      console.log('Checkout - Updated shipping address:', updated);
      return updated;
    });
  };

  // Find selected shipping option based on selectedShipping ID
  const selectedShippingOption = useMemo(() => {
    return availableShippingMethods.find(method => method.id === selectedShipping);
  }, [selectedShipping, availableShippingMethods]);

  // Fetch shipping methods when country/region changes
  useEffect(() => {
    if (country && region) {
      fetchShippingMethods();
    }
  }, [country, region]);

  // Validate shipping address
  const validateShippingAddress = () => {
    const requiredFields = ['address', 'country', 'region', 'phone', 'email', 'first_name', 'last_name'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      console.log('Checkout - Missing required fields:', missingFields);
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const fetchShippingMethods = async () => {
    try {
      // Имитируем получение методов доставки
      // В реальном приложении это был бы запрос к API
      const mockDeliveryMethods = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          base_price: 5.99,
          estimated_days: '5-7 business days',
          regions: [region],
          is_active: true
        },
        {
          id: 'express',
          name: 'Express Shipping',
          base_price: 12.99,
          estimated_days: '2-3 business days',
          regions: [region],
          is_active: true
        }
      ];

      const formattedMethods: ShippingOption[] = mockDeliveryMethods.map(method => ({
        id: method.id,
        name: method.name,
        price: method.base_price,
        currency: country === "US" ? "USD" : "CAD",
        estimatedDays: method.estimated_days || "Standard delivery"
      }));

      setAvailableShippingMethods(formattedMethods);
      
      // Reset selected shipping if it's not available in the new region
      if (!formattedMethods.find(m => m.id === selectedShipping)) {
        setSelectedShipping("");
      }
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      toast.error('Failed to load shipping options');
    }
  };

  const calculateTaxes = () => {
    if (!region) return { gst: 0, pst: 0, hst: 0, region: '' };
    
    const taxRates = country === "CA" 
      ? CANADIAN_TAX_RATES[region] 
      : US_TAX_RATES[region] || { pst: 0 };
    
    return {
      gst: taxRates.gst || 0,
      pst: taxRates.pst || 0,
      hst: taxRates.hst || 0,
      region: region
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Starting order submission with shipping address:', shippingAddress);

    if (!validateShippingAddress()) {
      return;
    }

    if (!selectedShipping) {
      toast.error("Please select a shipping method");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const customerDetails = {
        firstName: shippingAddress.first_name,
        lastName: shippingAddress.last_name,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        country,
        region
      };

      console.log('Customer details:', customerDetails);

      // Generate order number
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      console.log('Generated order number:', orderNumber);
      
      // Convert items to JSON-compatible format
      const jsonItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      
      // Prepare order data for API
      const orderData = {
        user_id: user?.id || null,
        profile_id: user?.id || null,
        order_number: orderNumber,
        total_amount: total,
        status: 'pending',
        items: jsonItems,
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
        }
      };

      console.log('Saving order to API:', orderData);

      // Здесь был бы запрос к API для сохранения заказа
      // await apiClient.saveOrder(orderData);

      console.log('Order saved successfully');

      // Send order confirmation email
      console.log('Sending order confirmation email');
      await apiClient.email.sendOrderEmails({
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

      console.log('Email sent successfully');

      // Store order details and redirect
      localStorage.setItem('lastOrder', JSON.stringify({
        orderNumber,
        customerDetails,
        items,
        total,
        shipping: selectedShippingOption
      }));

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
                onFormChange={handleFormChange}
              />

              {country && (
                <ShippingOptions
                  shippingOptions={availableShippingMethods}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                  currencySymbol={country === "US" ? "$" : "CAD $"}
                />
              )}

              <div className="space-y-4">
                <h3 className="font-medium">Payment Method</h3>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      }`}
                      onClick={() => {
                        console.log('Selected payment method:', method.id);
                        setSelectedPaymentMethod(method.id);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {method.icon_url && (
                          <img
                            src={method.icon_url}
                            alt={method.name}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          {method.description && (
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <StripeCheckout
                paymentMethodId={selectedPaymentMethod}
                isDisabled={!selectedPaymentMethod || !country || !region || !selectedShipping}
                taxes={taxes}
                shippingCost={selectedShippingOption?.price || 0}
                shippingAddress={{
                  address: shippingAddress.address,
                  country: country,
                  region: region,
                  phone: phoneNumber,
                  first_name: shippingAddress.first_name,
                  last_name: shippingAddress.last_name,
                  email: shippingAddress.email
                }}
              />
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
