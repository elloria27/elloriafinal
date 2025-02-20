
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";
import { AdminUserStep } from "./steps/AdminUserStep";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { supabase } from "@/integrations/supabase/client";

// Import the constants directly from the client file
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

interface AdminDetails {
  email: string;
  password: string;
  fullName: string;
}

export const InstallationWizard = () => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);

  useEffect(() => {
    checkSupabaseConfiguration();
  }, []);

  const checkSupabaseConfiguration = async () => {
    // Check if either URL or key is missing
    const isUnconfigured = !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY;
    
    if (isUnconfigured) {
      setIsOpen(true);
      // Add a class to hide the main content
      document.body.classList.add('installer-active');
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAdminDetailsSubmit = (details: AdminDetails) => {
    setAdminDetails(details);
    handleNext();
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
        {step === 3 && <AdminUserStep onSubmit={handleAdminDetailsSubmit} onBack={handleBack} />}
        {step === 4 && (
          <SupabaseConnectionStep 
            adminDetails={adminDetails!} 
            onNext={handleInstallationComplete} 
            onBack={handleBack} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
