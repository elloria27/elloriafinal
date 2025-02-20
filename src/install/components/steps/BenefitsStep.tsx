
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface BenefitsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const BenefitsStep = ({ onNext, onBack }: BenefitsStepProps) => {
  const benefits = [
    "Complete e-commerce solution with inventory management",
    "Blog system with categories and comments",
    "User management with role-based access control",
    "Invoice and expense tracking system",
    "Advanced analytics and reporting",
    "Task management and collaboration tools"
  ];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>System Benefits</DialogTitle>
        <DialogDescription>
          Here's what you'll get with our system
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
};
