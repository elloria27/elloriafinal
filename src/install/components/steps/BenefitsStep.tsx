
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface BenefitsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const BenefitsStep = ({ onNext, onBack }: BenefitsStepProps) => {
  const benefits = [
    "Complete e-commerce solution with cart and checkout",
    "Blog management system",
    "Customer relationship management (CRM)",
    "Invoice and estimate management",
    "Task management system",
    "Inventory tracking",
    "Analytics and reporting",
    "SEO optimization tools",
    "Multi-language support",
    "Responsive design for all devices"
  ];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>System Benefits</DialogTitle>
        <DialogDescription>
          Discover what makes Elloria the perfect choice for your business
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
