
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { AdminProfileStep } from "./steps/AdminProfileStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

export const InstallationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // If Supabase is configured, redirect to home
    if (isSupabaseConfigured()) {
      console.log('Redirecting to home from InstallationWizard');
      navigate('/');
    }
  }, [navigate]);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = () => {
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

  // Always show the dialog when on the setup page and Supabase is not configured
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};
