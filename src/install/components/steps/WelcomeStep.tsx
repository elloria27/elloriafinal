
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Welcome to Elloria</DialogTitle>
        <DialogDescription>
          Thank you for choosing Elloria for your business. Let's get started with setting up your system.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <p>
          This wizard will guide you through:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understanding the system benefits</li>
          <li>Connecting to your Supabase project</li>
          <li>Setting up your administrator account</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Get Started</Button>
      </div>
    </div>
  );
};
