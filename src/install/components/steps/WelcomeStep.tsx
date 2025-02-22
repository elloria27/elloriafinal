
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Welcome to Your Project Setup</DialogTitle>
        <DialogDescription>
          Let's get your project up and running in just a few simple steps.
          This wizard will help you set up everything you need.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <p>We'll help you:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Configure your database connection</li>
          <li>Set up your admin account</li>
          <li>Initialize your content</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Get Started</Button>
      </div>
    </div>
  );
};
