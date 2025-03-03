
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Steps } from "@/components/install-wizard/Steps";
import { WelcomeStep } from "@/components/install-wizard/WelcomeStep";
import { ConnectionStep } from "@/components/install-wizard/ConnectionStep";
import { MigrationStep } from "@/components/install-wizard/MigrationStep";
import { AdminSetupStep } from "@/components/install-wizard/AdminSetupStep";
import { CompleteStep } from "@/components/install-wizard/CompleteStep";

export default function InstallWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: "",
    key: "",
    projectId: "",
  });
  const [migrationState, setMigrationState] = useState({
    completed: false,
    progress: 0,
    currentTask: "",
    errors: [] as string[],
  });
  const [adminUser, setAdminUser] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const nextStep = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const steps = [
    "Welcome",
    "Connection",
    "Migration",
    "Admin Setup",
    "Complete",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <ConnectionStep
            config={supabaseConfig}
            setConfig={setSupabaseConfig}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <MigrationStep
            config={supabaseConfig}
            migrationState={migrationState}
            setMigrationState={setMigrationState}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <AdminSetupStep
            config={supabaseConfig}
            admin={adminUser}
            setAdmin={setAdminUser}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return <CompleteStep config={supabaseConfig} />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Helmet>
        <title>Installation Wizard | CMS Setup</title>
      </Helmet>
      
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            CMS Installation Wizard
          </h1>
          <p className="text-lg text-gray-600">
            Set up your CMS with a new Supabase project
          </p>
        </div>
        
        <Steps current={currentStep} steps={steps} />
        
        <Card className="p-8 shadow-lg border-t-4 border-primary">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
}
