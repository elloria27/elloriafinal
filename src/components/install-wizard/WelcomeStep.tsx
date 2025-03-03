
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center my-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to the CMS Installation Wizard
        </h2>
        <p className="mt-2 text-gray-600">
          This wizard will guide you through setting up the CMS with a Supabase project
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-lg text-blue-900 mb-2">
          Before you begin, make sure you have:
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center text-blue-800">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Created a Supabase project (or have admin access to one)
          </li>
          <li className="flex items-center text-blue-800">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Supabase project URL and API key
          </li>
          <li className="flex items-center text-blue-800">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Admin user credentials to create for the CMS
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg text-gray-900 mb-2">
          The installation will:
        </h3>
        <ul className="space-y-1 text-gray-600 list-disc pl-5">
          <li>Connect to your Supabase project</li>
          <li>Create all required tables and database structure</li>
          <li>Set up proper security policies</li>
          <li>Create an admin user</li>
          <li>Configure initial settings</li>
        </ul>
      </div>

      <Separator />
      
      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Let's Get Started
        </Button>
      </div>
    </div>
  );
}
