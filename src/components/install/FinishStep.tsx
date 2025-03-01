
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FinishStepProps {
  onBack: () => void;
  installationStatus: {
    connected: boolean;
    migrated: boolean;
    userCreated: boolean;
  };
}

const StatusItem = ({ 
  title, 
  isCompleted 
}: { 
  title: string; 
  isCompleted: boolean 
}) => (
  <div className="flex items-center space-x-3">
    {isCompleted ? (
      <CheckCircle2 className="h-6 w-6 text-green-600" />
    ) : (
      <XCircle className="h-6 w-6 text-red-500" />
    )}
    <span className={isCompleted ? "text-green-700" : "text-red-600"}>
      {title} {isCompleted ? "completed" : "failed"}
    </span>
  </div>
);

const FinishStep = ({ onBack, installationStatus }: FinishStepProps) => {
  const navigate = useNavigate();
  const allCompleted = Object.values(installationStatus).every(status => status);

  const handleFinish = () => {
    window.location.href = "/";
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Installation {allCompleted ? "Complete" : "Summary"}
      </h2>
      
      {allCompleted ? (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <p className="text-lg text-gray-700 mb-4">
            Congratulations! Your system has been successfully installed.
          </p>
          <p className="text-gray-600">
            You can now log in using the administrator account you created.
          </p>
        </div>
      ) : (
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Some installation steps were not completed successfully.
          </p>
          <p className="text-gray-600">
            Please review the status below and try again.
          </p>
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="font-semibold text-lg mb-4">Installation Status:</h3>
        <div className="space-y-3">
          <StatusItem 
            title="Database Connection" 
            isCompleted={installationStatus.connected} 
          />
          <StatusItem 
            title="Database Migration" 
            isCompleted={installationStatus.migrated} 
          />
          <StatusItem 
            title="Admin User Creation" 
            isCompleted={installationStatus.userCreated} 
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        {!allCompleted && (
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
        )}
        <div className={allCompleted ? "w-full" : ""}>
          <Button 
            onClick={handleFinish} 
            disabled={!allCompleted}
            className={allCompleted ? "w-full" : ""}
          >
            {allCompleted ? "Go to Dashboard" : "Finish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinishStep;
