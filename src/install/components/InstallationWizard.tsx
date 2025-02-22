
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WelcomeStep } from './steps/WelcomeStep';
import { BenefitsStep } from './steps/BenefitsStep';
import { SupabaseConnectionStep } from './steps/SupabaseConnectionStep';
import { AdminSetupStep } from './steps/AdminSetupStep';

type Step = {
  id: number;
  Component: React.ComponentType<any>;
  props: Record<string, any>;
};

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

  const steps: Step[] = [
    {
      id: 0,
      Component: WelcomeStep,
      props: { 
        onNext: handleNext 
      }
    },
    {
      id: 1,
      Component: BenefitsStep,
      props: { 
        onNext: handleNext, 
        onBack: handleBack 
      }
    },
    {
      id: 2,
      Component: SupabaseConnectionStep,
      props: { 
        onNext: handleNext, 
        onBack: handleBack 
      }
    },
    {
      id: 3,
      Component: AdminSetupStep,
      props: { 
        onBack: handleBack, 
        onComplete: handleClose 
      }
    }
  ];

  const currentStep = steps[step];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <currentStep.Component {...currentStep.props} />
      </DialogContent>
    </Dialog>
  );
};
