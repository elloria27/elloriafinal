
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface BenefitsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const BenefitsStep = ({ onNext, onBack }: BenefitsStepProps) => {
  const benefits = [
    {
      title: "Complete E-commerce Solution",
      description: "Fully featured online store with product management, order processing, and inventory tracking",
    },
    {
      title: "Customer Management",
      description: "Built-in CRM features to manage customer relationships and track interactions",
    },
    {
      title: "Powerful Analytics",
      description: "Comprehensive reporting and analytics to track your business performance",
    },
    {
      title: "Multi-language Support",
      description: "Reach customers globally with built-in internationalization",
    },
    {
      title: "Secure & Scalable",
      description: "Enterprise-grade security and scalability powered by Supabase",
    },
  ];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Platform Benefits</DialogTitle>
        <DialogDescription>
          Discover what our e-commerce platform can do for your business
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
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
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
};
