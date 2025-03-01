
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import WelcomeStep from "@/components/install/WelcomeStep";
import BenefitsStep from "@/components/install/BenefitsStep";
import DatabaseConnectionStep from "@/components/install/DatabaseConnectionStep";
import UserSetupStep from "@/components/install/UserSetupStep";
import FinishStep from "@/components/install/FinishStep";
import { supabase } from "@/integrations/supabase/client";

const Install = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: "",
    key: ""
  });
  const [adminUser, setAdminUser] = useState({
    email: "",
    password: "",
    fullName: ""
  });
  const [installationStatus, setInstallationStatus] = useState({
    connected: false,
    migrated: false,
    userCreated: false
  });

  useEffect(() => {
    // Check if Supabase is already properly connected and database is set up
    const checkInstallation = async () => {
      try {
        // Set a timeout to prevent the check from hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Connection timeout")), 5000);
        });

        // Try to query a basic table to check connection
        const queryPromise = supabase.from('site_settings').select('*').limit(1);
        
        // Race between the timeout and the query
        const result = await Promise.race([
          queryPromise,
          timeoutPromise.then(() => ({ data: null, error: new Error("Connection timeout") }))
        ]) as any;
        
        const { data, error } = result;
        
        if (!error && data) {
          console.log("Supabase already connected and initialized");
          setIsInstalled(true);
        } else {
          console.log("Supabase needs setup:", error);
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkInstallation();
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSupabaseConfig = (config: { url: string; key: string }) => {
    setSupabaseConfig(config);
  };

  const handleAdminUser = (user: { email: string; password: string; fullName: string }) => {
    setAdminUser(user);
  };

  const updateInstallationStatus = (status: Partial<typeof installationStatus>) => {
    setInstallationStatus(prev => ({ ...prev, ...status }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Checking installation status...</p>
        </div>
      </div>
    );
  }

  if (isInstalled) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/10 to-secondary/10">
      <header className="py-6 px-8 border-b bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Installation Wizard</h1>
          <div className="text-sm text-gray-600">
            Step {currentStep} of 5
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {currentStep === 1 && (
            <WelcomeStep onNext={handleNextStep} />
          )}
          
          {currentStep === 2 && (
            <BenefitsStep onNext={handleNextStep} onBack={handlePrevStep} />
          )}
          
          {currentStep === 3 && (
            <DatabaseConnectionStep 
              onNext={handleNextStep} 
              onBack={handlePrevStep}
              onConfigUpdate={handleSupabaseConfig}
              config={supabaseConfig}
              updateStatus={updateInstallationStatus}
            />
          )}
          
          {currentStep === 4 && (
            <UserSetupStep 
              onNext={handleNextStep} 
              onBack={handlePrevStep}
              onUserUpdate={handleAdminUser}
              user={adminUser}
              supabaseConfig={supabaseConfig}
              updateStatus={updateInstallationStatus}
            />
          )}
          
          {currentStep === 5 && (
            <FinishStep 
              onBack={handlePrevStep} 
              installationStatus={installationStatus}
            />
          )}
        </div>
      </main>

      <footer className="py-4 px-8 border-t bg-white">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Install;
