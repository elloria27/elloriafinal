
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { saveSupabaseConfig } from "@/utils/migration";

interface CompleteStepProps {
  config: {
    url: string;
    key: string;
    projectId: string;
  };
}

export function CompleteStep({ config }: CompleteStepProps) {
  const handleFinish = () => {
    // Save Supabase config permanently
    saveSupabaseConfig(config);
    
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-3 mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Installation Complete!
        </h2>
        <p className="mt-2 text-gray-600">
          Your CMS has been successfully set up with Supabase
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg text-gray-900 mb-2">
          What's been setup:
        </h3>
        <ul className="space-y-1 text-gray-600">
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
            Database tables and structure
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
            Security policies
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
            Admin user account
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
            Initial site settings
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-lg text-blue-900 mb-2">
          Next steps:
        </h3>
        <ul className="space-y-1 text-blue-800">
          <li className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <span>Log in with your admin credentials</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <span>Customize your site settings</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <span>Create your first pages and content</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <span>Set up your products and blog posts</span>
          </li>
        </ul>
      </div>

      <Separator />
      
      <div className="flex justify-center space-x-4">
        <Button onClick={handleFinish} size="lg">
          Finish & Go to Homepage
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          asChild
        >
          <Link to="/admin">
            Go to Admin Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
