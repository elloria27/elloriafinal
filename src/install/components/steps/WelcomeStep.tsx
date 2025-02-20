
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Welcome to the Installation Wizard</DialogTitle>
        <DialogDescription>
          Let's get your application up and running in just a few steps.
          This wizard will guide you through the setup process.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end">
        <Button onClick={onNext}>Get Started</Button>
      </div>
    </div>
  );
};
