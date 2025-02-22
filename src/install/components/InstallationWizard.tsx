
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WelcomeStep } from './steps/WelcomeStep';
import { BenefitsStep } from './steps/BenefitsStep';
import { SupabaseConnectionStep } from './steps/SupabaseConnectionStep';
import { AdminSetupStep } from './steps/AdminSetupStep';

export const InstallationWizard = () => {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const steps = [
    {
      component: WelcomeStep,
      props: { onNext: handleNext }
    },
    {
      component: BenefitsStep,
      props: { onNext: handleNext, onBack: handleBack }
    },
    {
      component: SupabaseConnectionStep,
      props: { onNext: handleNext, onBack: handleBack }
    },
    {
      component: AdminSetupStep,
      props: { onBack: handleBack, onComplete: handleClose }
    }
  ];

  const CurrentStep = steps[step].component;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <CurrentStep {...steps[step].props} />
      </DialogContent>
    </Dialog>
  );
};
