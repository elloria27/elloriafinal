
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">Welcome to Installation Wizard</h2>
      
      <div className="text-center mb-8">
        <img src="/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png" alt="Logo" className="mx-auto h-32 mb-4" />
        <p className="text-lg text-gray-700">
          Thank you for choosing our system. This wizard will guide you through the installation process.
        </p>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h3 className="font-semibold text-lg mb-3">Installation Process:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Welcome and introduction</li>
          <li>System benefits overview</li>
          <li>Database connection setup</li>
          <li>Administrator account creation</li>
          <li>Finalize installation</li>
        </ul>
      </div>
      
      <div className="text-gray-700 mb-8">
        <p className="mb-2">
          Before proceeding, please ensure you have:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>A Supabase account and project</li>
          <li>Your Supabase project URL and API key ready</li>
          <li>Administrator email and password prepared</li>
        </ul>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onNext} className="px-8">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
