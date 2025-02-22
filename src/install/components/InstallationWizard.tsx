
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { AdminProfileStep } from "./steps/AdminProfileStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { supabase } from "@/integrations/supabase/client";

export const InstallationWizard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    const SUPABASE_URL = "https://euexcsqvsbkxiwdieepu.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXhjc3F2c2JreGl3ZGllZXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1OTE0ODYsImV4cCI6MjA1MzE2NzQ4Nn0.SA8nsT8fEf2Igd91FNUNFYxT0WQb9qmYblrxxE7eV4U";

    // Check if Supabase is configured
    if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
      navigate('/');
      return;
    }

    // If not configured, show the wizard
    setIsOpen(true);
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
