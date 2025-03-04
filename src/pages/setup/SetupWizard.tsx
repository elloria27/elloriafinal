
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft, Database, UserPlus, Globe, Check, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import WelcomeStep from "@/pages/setup/steps/WelcomeStep";
import ConnectionStep from "@/pages/setup/steps/ConnectionStep";
import DatabaseStep from "@/pages/setup/steps/DatabaseStep";
import AdminStep from "@/pages/setup/steps/AdminStep";
import SettingsStep from "@/pages/setup/steps/SettingsStep";
import CompleteStep from "@/pages/setup/steps/CompleteStep";

type SetupStep = {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: JSX.Element;
};

const setupSteps: SetupStep[] = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Start the installation process",
    path: "",
    icon: <ArrowRight className="h-5 w-5" />,
  },
  {
    id: "connection",
    title: "Supabase Connection",
    description: "Connect to your Supabase project",
    path: "connection",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "database",
    title: "Database Setup",
    description: "Configure database tables and initial data",
    path: "database",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "admin",
    title: "Admin Account",
    description: "Create your admin account",
    path: "admin",
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    id: "settings",
    title: "Site Settings",
    description: "Configure basic site settings",
    path: "settings",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "complete",
    title: "Installation Complete",
    description: "Setup complete successfully",
    path: "complete",
    icon: <Check className="h-5 w-5" />,
  },
];

export default function SetupWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [setupStatus, setSetupStatus] = useState<Record<string, "pending" | "complete" | "error">>({
    welcome: "pending",
    connection: "pending",
    database: "pending",
    admin: "pending",
    settings: "pending",
    complete: "pending",
  });
  const [setupData, setSetupData] = useState({
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceRoleKey: "",
    adminEmail: "",
    adminPassword: "",
    adminName: "",
    siteTitle: "Elloria",
    siteLanguage: "en",
    contactEmail: "",
  });

  useEffect(() => {
    // Determine current step index based on path
    const path = location.pathname.replace("/setup/", "");
    const index = setupSteps.findIndex((step) => 
      (path === "" && step.path === "") || 
      (path !== "" && step.path === path)
    );
    
    if (index !== -1) {
      setCurrentStepIndex(index);
    } else {
      // Redirect to the first step if path doesn't match any step
      navigate("/setup");
    }
  }, [location.pathname, navigate]);

  const progressPercentage = ((currentStepIndex) / (setupSteps.length - 1)) * 100;

  const updateSetupData = (data: Partial<typeof setupData>) => {
    setSetupData((prev) => ({ ...prev, ...data }));
  };

  const updateSetupStatus = (step: string, status: "pending" | "complete" | "error") => {
    setSetupStatus((prev) => ({ ...prev, [step]: status }));
  };

  const nextStep = () => {
    if (currentStepIndex < setupSteps.length - 1) {
      navigate(`/setup/${setupSteps[currentStepIndex + 1].path}`);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      navigate(`/setup/${setupSteps[currentStepIndex - 1].path}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-center py-8 bg-white border-b">
        <div className="container">
          <h1 className="text-3xl font-bold text-center">Elloria Setup Wizard</h1>
        </div>
      </div>

      <div className="container py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
              {setupSteps.map((step, index) => (
                <Card 
                  key={step.id}
                  className={`p-4 flex items-center gap-3 ${
                    index === currentStepIndex 
                      ? "border-blue-500 bg-blue-50" 
                      : index < currentStepIndex 
                        ? "border-green-500 bg-green-50" 
                        : "bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    index === currentStepIndex 
                      ? "bg-blue-100 text-blue-600" 
                      : index < currentStepIndex 
                        ? "bg-green-100 text-green-600" 
                        : "bg-gray-100 text-gray-600"
                  }`}>
                    {setupStatus[step.id] === "complete" ? (
                      <Check className="h-5 w-5" />
                    ) : setupStatus[step.id] === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-6 shadow-sm">
            <Routes>
              <Route 
                path="" 
                element={
                  <WelcomeStep 
                    onNext={() => {
                      updateSetupStatus("welcome", "complete");
                      nextStep();
                    }} 
                  />
                } 
              />
              <Route 
                path="connection" 
                element={
                  <ConnectionStep 
                    setupData={setupData}
                    updateSetupData={updateSetupData}
                    updateSetupStatus={updateSetupStatus} 
                    onNext={nextStep} 
                    onPrev={prevStep}
                  />
                } 
              />
              <Route 
                path="database" 
                element={
                  <DatabaseStep 
                    setupData={setupData}
                    updateSetupStatus={updateSetupStatus} 
                    onNext={nextStep} 
                    onPrev={prevStep}
                  />
                } 
              />
              <Route 
                path="admin" 
                element={
                  <AdminStep 
                    setupData={setupData}
                    updateSetupData={updateSetupData}
                    updateSetupStatus={updateSetupStatus} 
                    onNext={nextStep} 
                    onPrev={prevStep}
                  />
                } 
              />
              <Route 
                path="settings" 
                element={
                  <SettingsStep 
                    setupData={setupData}
                    updateSetupData={updateSetupData}
                    updateSetupStatus={updateSetupStatus} 
                    onNext={nextStep} 
                    onPrev={prevStep}
                  />
                } 
              />
              <Route 
                path="complete" 
                element={
                  <CompleteStep 
                    updateSetupStatus={updateSetupStatus} 
                  />
                } 
              />
            </Routes>
          </Card>
        </div>
      </div>

      <div className="py-4 bg-white border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Elloria | Setup Wizard v1.0
      </div>
    </div>
  );
}
