
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { SupabaseConnectionStep } from "./steps/SupabaseConnectionStep";
import { AdminUserStep } from "./steps/AdminUserStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BenefitsStep } from "./steps/BenefitsStep";

export const InstallationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [adminDetails, setAdminDetails] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleAdminDetails = (details: { email: string; password: string; fullName: string }) => {
    setAdminDetails(details);
    handleNext();
  };

  const handleComplete = () => {
    // Handle installation completion
    window.location.href = "/";
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <BenefitsStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <SupabaseConnectionStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <AdminUserStep onSubmit={handleAdminDetails} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-background p-6 shadow-lg duration-200 rounded-xl border">
        {renderStep()}
      </div>
    </Dialog>
  );
};
