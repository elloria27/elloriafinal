
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { AdminProfileStep } from "./steps/AdminProfileStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { supabase } from "@/integrations/supabase/client";

export const InstallationWizard = () => {
  const [isOpen, setIsOpen] = useState(true); // Changed to true by default
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    console.log("Installation Wizard mounted");
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    try {
      console.log("Checking installation...");
      // Try to connect to Supabase
      const { data, error } = await supabase.from('profiles').select('count');
      
      console.log("Supabase check result:", { data, error });
      
      // If we can't connect, show the wizard
      if (error) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Installation check error:", error);
      setIsOpen(true);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    setIsOpen(false);
    window.location.reload();
  };

  console.log("Installation Wizard rendering with state:", { isOpen, currentStep });

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <BenefitsStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <AdminProfileStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <SupabaseConnectionStep onNext={handleComplete} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};
