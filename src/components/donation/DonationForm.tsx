import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const DonationForm = () => {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for success parameter in URL
    const success = searchParams.get("success");
    if (success === "true") {
      toast.success(
        "Thank you for your generous donation! Your support makes a real difference.",
        {
          duration: 6000,
        }
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalAmount = amount || customAmount;
      if (!finalAmount) {
        toast.error("Please select or enter a donation amount");
        return;
      }

      const { data: response, error } = await supabase.functions.invoke(
        "create-donation-checkout",
        {
          body: {
            amount: parseFloat(finalAmount),
            donor_name: donorName,
            donor_email: donorEmail,
            success_url: `${window.location.origin}/donation?success=true`,
            cancel_url: `${window.location.origin}/donation`,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error(
        "There was an error processing your donation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white" id="donation-form">
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Your Name (Optional)</Label>
                <Input
                  id="donorName"
                  type="text"
                  placeholder="Enter your name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorEmail">Your Email (Optional)</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading || (!amount && !customAmount)}
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