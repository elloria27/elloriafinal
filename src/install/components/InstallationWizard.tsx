
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { AdminSetupStep } from "./steps/AdminSetupStep";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const InstallationWizard = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    try {
      // Try to connect to Supabase
      const { data, error } = await supabase.from('site_settings').select('*');
      
      if (!error) {
        // If we can connect and the table exists, redirect to home
        navigate('/');
      }
    } catch (error) {
      // If there's an error, we stay on the setup page
      console.log('Installation required');
    }
  };

  const handleComplete = () => {
    navigate('/');
  };

  const steps = [
    <WelcomeStep onNext={() => setStep(1)} />,
    <BenefitsStep onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <SupabaseConnectionStep onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <AdminSetupStep onComplete={handleComplete} onBack={() => setStep(2)} />,
  ];

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[500px]">
        {steps[step]}
      </DialogContent>
    </Dialog>
  );
};
