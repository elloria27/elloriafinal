
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { AdminUserStep } from "./steps/AdminUserStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { supabase } from "@/integrations/supabase/client";

export const InstallationWizard = () => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkSupabaseConfiguration();
  }, []);

  const checkSupabaseConfiguration = async () => {
    // Get the configuration values
    const url = supabase.getUrl();
    const key = supabase.getPublicKey();

    // Check if either URL or key is empty/invalid
    const isUnconfigured = !url || !key || url === "undefined" || key === "undefined";
    
    if (isUnconfigured) {
      setIsOpen(true);
      // Add a class to hide the main content
      document.body.classList.add('installer-active');
    }
  };

  const handleInstallationComplete = () => {
    setIsOpen(false);
    // Remove the class that hides the main content
    document.body.classList.remove('installer-active');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e) => e.preventDefault()}>
        {step === 1 && <WelcomeStep onNext={handleNext} />}
        {step === 2 && <BenefitsStep onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <AdminUserStep onNext={handleNext} onBack={handleBack} />}
        {step === 4 && (
          <SupabaseConnectionStep onNext={handleInstallationComplete} onBack={handleBack} />
        )}
      </DialogContent>
    </Dialog>
  );
};
