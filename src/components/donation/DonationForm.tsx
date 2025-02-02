import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const DonationForm = () => {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get Stripe payment method
      const { data: paymentMethod } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('name', 'stripe')
        .single();

      if (!paymentMethod?.id) {
        throw new Error('Stripe payment method not configured');
      }

      const finalAmount = amount || customAmount;
      if (!finalAmount) {
        throw new Error('Please select or enter an amount');
      }

      if (!email) {
        throw new Error('Email is required');
      }

      console.log('Creating checkout session with:', {
        amount: finalAmount,
        email,
        name,
        paymentMethodId: paymentMethod.id
      });

      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          type: 'donation',
          amount: Number(finalAmount),
          email,
          name,
          paymentMethodId: paymentMethod.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }

      console.log('Checkout session created:', response);

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error processing donation:', error);
      toast.error(error.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Make a Difference Today
            </h2>
            <p className="text-lg text-gray-600">
              Your donation helps us provide essential care products to women and
              girls in need. Choose an amount to contribute:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label>Select Donation Amount</Label>
              <RadioGroup
                value={amount}
                onValueChange={(value) => {
                  setAmount(value);
                  setCustomAmount("");
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {["25", "50", "100"].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`amount-${value}`} />
                    <Label htmlFor={`amount-${value}`}>${value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Or Enter Custom Amount</Label>
              <Input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount("");
                }}
                className="max-w-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading || (!amount && !customAmount) || !email}
            >
              {loading ? "Processing..." : "Donate Now"}
            </Button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Your donation is secure and encrypted. You'll receive a confirmation
              email with your donation receipt.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};