
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Welcome to Your E-commerce Platform</DialogTitle>
        <DialogDescription>
          Let's set up your personal e-commerce system in just a few steps.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <p>
          This wizard will guide you through the process of setting up your own
          e-commerce platform. We'll help you:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Configure your system settings</li>
          <li>Set up your administrator account</li>
          <li>Connect to your database</li>
          <li>Initialize your store</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Get Started</Button>
      </div>
    </div>
  );
};
