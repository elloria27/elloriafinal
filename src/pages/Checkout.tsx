import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { 
  CANADIAN_TAX_RATES, 
  US_TAX_RATES, 
  SHIPPING_OPTIONS,
  USD_TO_CAD,
  type ShippingOption 
} from "@/utils/locationData";

const COUNTRIES = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
];

const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
];

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, activePromoCode, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  // Calculate taxes based on region
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

  // Get current shipping options
  const shippingOptions = country ? SHIPPING_OPTIONS[country] : [];
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);

  // Calculate final totals
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    clearCart();
    toast.success("Order placed successfully!");
    navigate("/");
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-2 md:order-1"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={(value) => {
                  setCountry(value);
                  setRegion("");
                  setSelectedShipping("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {country && (
                <div className="space-y-2">
                  <Label htmlFor="region">
                    {country === "CA" ? "Province" : "State"}
                  </Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${country === "CA" ? "province" : "state"}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(country === "CA" ? PROVINCES : STATES).map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {country && (
                <div className="space-y-2">
                  <Label>Shipping Method</Label>
                  <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1">
                            <div className="flex justify-between">
                              <span>{option.name}</span>
                              <span>{currencySymbol}{option.price.toFixed(2)}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {option.estimatedDays}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
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
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-primary">
                        {currencySymbol}
                        {(country === "US" 
                          ? (item.price * item.quantity) / USD_TO_CAD 
                          : item.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{subtotalInCurrentCurrency.toFixed(2)}</span>
                </div>

                {taxes.gst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>GST ({taxes.gst}%)</span>
                    <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.gst / 100).toFixed(2)}</span>
                  </div>
                )}

                {taxes.pst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>
                      {country === "CA" ? "PST" : "Sales Tax"} ({taxes.pst}%)
                    </span>
                    <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.pst / 100).toFixed(2)}</span>
                  </div>
                )}

                {taxes.hst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>HST ({taxes.hst}%)</span>
                    <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.hst / 100).toFixed(2)}</span>
                  </div>
                )}

                {selectedShippingOption && (
                  <div className="flex justify-between text-sm">
                    <span>Shipping ({selectedShippingOption.name})</span>
                    <span>{currencySymbol}{selectedShippingOption.price.toFixed(2)}</span>
                  </div>
                )}
                
                {activePromoCode && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount ({activePromoCode.discount}%)</span>
                    <span>
                      -{currencySymbol}
                      {((subtotalInCurrentCurrency * activePromoCode.discount) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;