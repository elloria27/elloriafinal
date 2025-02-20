
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { AdminUserStep } from "./steps/AdminUserStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { createClient } from "@supabase/supabase-js";

export const InstallationWizard = () => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL || "",
        process.env.SUPABASE_ANON_KEY || ""
      );
      const { data } = await supabase.from("user_roles").select("count");
      // If we can query, connection exists
      setIsOpen(false);
    } catch (error) {
      // If error, no connection exists
      setIsOpen(true);
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 1 && <WelcomeStep onNext={handleNext} />}
        {step === 2 && <BenefitsStep onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <AdminUserStep onNext={handleNext} onBack={handleBack} />}
        {step === 4 && (
          <SupabaseConnectionStep onNext={() => setIsOpen(false)} onBack={handleBack} />
        )}
      </DialogContent>
    </Dialog>
  );
};
