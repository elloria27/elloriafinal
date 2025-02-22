
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface BenefitsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const BenefitsStep = ({ onNext, onBack }: BenefitsStepProps) => {
  const benefits = [
    {
      title: "Complete Business Solution",
      description: "Manage your entire business workflow from one place"
    },
    {
      title: "Secure Database",
      description: "Built on Supabase for reliable and secure data storage"
    },
    {
      title: "Modern UI/UX",
      description: "Beautiful, responsive interface built with modern technologies"
    },
    {
      title: "Customizable",
      description: "Easily adapt the system to your specific needs"
    }
  ];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Why Choose Our System?</DialogTitle>
        <DialogDescription>
          Discover the key features and benefits that make our system stand out.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-1">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};
