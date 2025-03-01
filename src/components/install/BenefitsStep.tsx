
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Database, Users, BarChart } from "lucide-react";

interface BenefitsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const BenefitCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<any>; 
  title: string; 
  description: string 
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start">
      <div className="mr-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const BenefitsStep = ({ onNext, onBack }: BenefitsStepProps) => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Secure Authentication",
      description: "Built-in user authentication and authorization with role-based access control."
    },
    {
      icon: Database,
      title: "Powerful Database",
      description: "PostgreSQL database with real-time subscriptions and powerful query capabilities."
    },
    {
      icon: Zap,
      title: "Serverless Functions",
      description: "Edge functions for custom backend logic without managing servers."
    },
    {
      icon: Users,
      title: "User Management",
      description: "Complete user management system with profiles, roles, and permissions."
    },
    {
      icon: BarChart,
      title: "Analytics & Insights",
      description: "Track page views, user activity, and gain valuable business insights."
    }
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">System Benefits</h2>
      
      <p className="text-center text-lg text-gray-700 mb-8">
        Our system provides powerful features to help your business grow.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {benefits.map((benefit, index) => (
          <BenefitCard 
            key={index} 
            icon={benefit.icon} 
            title={benefit.title} 
            description={benefit.description} 
          />
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BenefitsStep;
