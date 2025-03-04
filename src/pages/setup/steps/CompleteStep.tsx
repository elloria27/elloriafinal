
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Home, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompleteStepProps {
  updateSetupStatus: (step: string, status: "pending" | "complete" | "error") => void;
}

export default function CompleteStep({ updateSetupStatus }: CompleteStepProps) {
  const navigate = useNavigate();

  useEffect(() => {
    updateSetupStatus("complete", "complete");
  }, [updateSetupStatus]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold">Installation Complete!</h2>
        <p className="text-gray-500">
          Congratulations! Your Elloria application has been successfully set up and is
          ready to use. You can now access your site and admin dashboard.
        </p>
      </div>

      <div className="space-y-4 my-8 border-t border-b py-6">
        <h3 className="text-lg font-semibold">Next Steps</h3>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <div className="bg-white p-1.5 rounded border">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Set up your site content</p>
              <p className="text-sm text-gray-500">
                Create pages, products, and blog posts to populate your site
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <div className="bg-white p-1.5 rounded border">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Configure site appearance</p>
              <p className="text-sm text-gray-500">
                Customize your site's logo, colors, and layout
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <div className="bg-white p-1.5 rounded border">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Set up advanced features</p>
              <p className="text-sm text-gray-500">
                Configure payments, shipping, and user accounts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
        <Button
          onClick={() => navigate("/")}
          className="flex-1"
          variant="outline"
          size="lg"
        >
          <Home className="mr-2 h-5 w-5" />
          Go to Homepage
        </Button>
        
        <Button
          onClick={() => navigate("/admin")}
          className="flex-1"
          size="lg"
        >
          <Settings className="mr-2 h-5 w-5" />
          Go to Admin Dashboard
        </Button>
      </div>
      
      <div className="text-center pt-2">
        <a 
          href="https://docs.example.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm inline-flex items-center"
        >
          View Documentation
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
