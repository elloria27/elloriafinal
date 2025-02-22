
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { AdminProfileStep } from "./steps/AdminProfileStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { supabase } from "@/integrations/supabase/client";

export const InstallationWizard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    try {
      // Try to connect to Supabase
      const { data, error } = await supabase.from('profiles').select('count');
      
      // If we can't connect, show the wizard
      if (error) {
        setIsOpen(true);
      }
    } catch (error) {
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
