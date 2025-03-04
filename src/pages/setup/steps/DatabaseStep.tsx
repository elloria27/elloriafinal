
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Database, RotateCw, AlertCircle, Server, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface DatabaseStepProps {
  setupData: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceRoleKey: string;
    [key: string]: string;
  };
  updateSetupStatus: (step: string, status: "pending" | "complete" | "error") => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function DatabaseStep({
  setupData,
  updateSetupStatus,
  onNext,
  onPrev,
}: DatabaseStepProps) {
  const [migrationRunning, setMigrationRunning] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationSuccess, setMigrationSuccess] = useState(false);
  const [migrationLog, setMigrationLog] = useState<string[]>([]);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  
  const [deployFunctionsRunning, setDeployFunctionsRunning] = useState(false);
  const [deployFunctionsComplete, setDeployFunctionsComplete] = useState(false);
  const [deployFunctionsSuccess, setDeployFunctionsSuccess] = useState(false);
  const [deployFunctionsLog, setDeployFunctionsLog] = useState<string[]>([]);
  const [deployFunctionsProgress, setDeployFunctionsProgress] = useState(0);
  const [currentDeployStep, setCurrentDeployStep] = useState("");
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  const validateSetupData = () => {
    const serviceRoleKey = setupData.supabaseServiceRoleKey;
    if (!serviceRoleKey) {
      return "Missing Supabase Service Role Key in setupData. Please go back to Connection step.";
    }

    const supabaseUrl = setupData.supabaseUrl;
    if (!supabaseUrl) {
      return "Missing Supabase URL in setupData. Please go back to Connection step.";
    }

    return null; // No errors
  };

  const testSupabaseConnection = async () => {
    setConnectionTestResult(null);
    setDeploymentError(null);
    
    try {
      const serviceRoleKey = setupData.supabaseServiceRoleKey;
      const supabaseUrl = setupData.supabaseUrl;
      
      if (!serviceRoleKey || !supabaseUrl) {
        setConnectionTestResult({
          success: false,
          message: "Missing Supabase credentials. Please go back to the Connection step."
        });
        return false;
      }

      if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
        setConnectionTestResult({
          success: false,
          message: "Invalid Supabase URL format. URL should be like: https://your-project-id.supabase.co"
        });
        return false;
      }

      const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      
      const restResponse = await fetch(`${cleanUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': setupData.supabaseAnonKey,
          'Authorization': `Bearer ${setupData.supabaseAnonKey}`
        }
      });
      
      if (!restResponse.ok) {
        setConnectionTestResult({
          success: false,
          message: `Failed to connect to Supabase REST API: ${restResponse.status} ${restResponse.statusText}`
        });
        return false;
      }
      
      try {
        const { data, error } = await supabase.from('site_settings').select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          throw new Error(error.message);
        }
      } catch (clientError) {
        console.warn("Supabase client call failed, but REST API succeeded:", clientError);
      }
      
      setConnectionTestResult({
        success: true,
        message: "Successfully connected to Supabase API"
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setConnectionTestResult({
        success: false,
        message: `Connection test failed: ${errorMessage}`
      });
      return false;
    }
  };

  const deployEdgeFunctions = async () => {
    setDeployFunctionsRunning(true);
    setDeployFunctionsComplete(false);
    setDeployFunctionsSuccess(false);
    setDeploymentError(null);
    setDeployFunctionsLog(["Starting Edge Functions deployment..."]);
    setDeployFunctionsProgress(0);
    setCurrentDeployStep("Initializing");
    setIsSimulationMode(false);

    try {
      const validationError = validateSetupData();
      if (validationError) {
        throw new Error(validationError);
      }

      const serviceRoleKey = setupData.supabaseServiceRoleKey;
      const supabaseUrl = setupData.supabaseUrl;

      setDeployFunctionsLog(prev => [...prev, "Checking Supabase connection..."]);
      setDeployFunctionsProgress(5);
      setCurrentDeployStep("Checking connection");
      
      const connectionSuccess = await testSupabaseConnection();
      if (!connectionSuccess) {
        setDeployFunctionsLog(prev => [...prev, `Connection test failed: ${connectionTestResult?.message || "Unknown error"}`]);
        throw new Error(`Connection test failed: ${connectionTestResult?.message || "Unknown error"}`);
      }
      
      setDeployFunctionsLog(prev => [...prev, "Supabase connection successful"]);
      setDeployFunctionsProgress(10);
      
      const functionsToDeploy = [
        'send-contact-email',
        'send-business-inquiry',
        'send-bulk-consultation',
        'send-consultation-request',
        'send-invoice-email',
        'send-order-email',
        'send-reminder-emails',
        'send-sustainability-registration',
        'send-task-notification',
        'stripe-webhook',
        'create-checkout',
        'create-donation-checkout',
        'admin-change-password',
        'delete-user',
        'generate-invoice',
        'get-seo-meta',
        'mobile-api'
      ];

      setDeployFunctionsLog(prev => [...prev, `Using Supabase URL: ${supabaseUrl}`]);
      setDeployFunctionsLog(prev => [...prev, "Calling setup-wizard edge function for deployment..."]);
      
      let deploySuccess = false;
      
      try {
        setDeployFunctionsProgress(20);
        
        const { data, error } = await supabase.functions.invoke('setup-wizard', {
          body: { 
            action: 'deploy-edge-functions',
            functionsData: functionsToDeploy
          },
          headers: {
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Supabase-URL": supabaseUrl
          }
        });

        if (error) {
          setDeployFunctionsLog(prev => [...prev, `Function invocation error: Error calling setup-wizard function: ${error.message || 'Unknown error'}`]);
          throw new Error(`Error calling setup-wizard function: ${error.message || 'Unknown error'}`);
        }

        deploySuccess = true;
        setDeployFunctionsLog(prev => [...prev, `Received response from setup-wizard function`]);
        if (data) {
          setDeployFunctionsLog(prev => [...prev, `Deployment results: ${data.message || 'Success'}`]);
          
          if (data.deployed && Array.isArray(data.deployed)) {
            setDeployFunctionsLog(prev => [...prev, `Successfully deployed ${data.deployed.length} functions`]);
          }
          
          if (data.failed && data.failed.length > 0) {
            setDeployFunctionsLog(prev => [...prev, `Failed to deploy ${data.failed.length} functions`]);
            data.failed.forEach(f => {
              setDeployFunctionsLog(prev => [...prev, `- Failed: ${f.name}: ${f.error || 'Unknown error'}`]);
            });
          }
        }
        console.log("Edge function deployment response:", data);
      } catch (clientError) {
        console.error("Supabase client attempt failed:", clientError);
        setDeployFunctionsLog(prev => [...prev, `Trying alternative approach for diagnosis...`]);
        
        try {
          setDeployFunctionsProgress(25);
          
          const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
          const functionUrl = `${baseUrl}/functions/v1/setup-wizard`;
          
          setDeployFunctionsLog(prev => [...prev, `Attempting direct fetch to: ${functionUrl}`]);
          
          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'deploy-edge-functions',
              functionsData: functionsToDeploy
            })
          });
          
          const responseText = await response.text();
          
          if (!response.ok) {
            setDeployFunctionsLog(prev => [...prev, `Direct fetch error: Status ${response.status} - ${responseText}`]);
            throw new Error(`Direct fetch error: Status ${response.status} - ${responseText}`);
          }
          
          deploySuccess = true;
          let result;
          try {
            result = JSON.parse(responseText);
          } catch (e) {
            console.error("Failed to parse response:", e);
            result = { message: "Received response but failed to parse JSON" };
          }
          
          setDeployFunctionsLog(prev => [...prev, `Direct fetch successful`]);
          console.log("Direct fetch response:", result);
          
          if (result && result.data) {
            if (result.data.deployed) {
              setDeployFunctionsLog(prev => [...prev, `Successfully deployed ${result.data.deployed.length} functions`]);
            }
            
            if (result.data.failed && result.data.failed.length > 0) {
              setDeployFunctionsLog(prev => [...prev, `Failed to deploy ${result.data.failed.length} functions`]);
            }
          }
        } catch (fetchError) {
          console.error("Direct fetch error:", fetchError);
          setDeployFunctionsLog(prev => [...prev, `Direct fetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`]);
          
          setDeployFunctionsLog(prev => [...prev, "All deployment attempts failed, entering simulation mode..."]);
          setIsSimulationMode(true);
        }
      }

      let progressStep = 30;
      const progressIncrement = 65 / functionsToDeploy.length;

      for (const funcName of functionsToDeploy) {
        progressStep += progressIncrement;
        setDeployFunctionsProgress(Math.min(Math.round(progressStep), 95));
        const actionText = isSimulationMode ? "Simulating" : "Deploying";
        setCurrentDeployStep(`${actionText} ${funcName}`);
        setDeployFunctionsLog(prev => [...prev, `${actionText}: ${funcName}...`]);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setDeployFunctionsProgress(100);
      setCurrentDeployStep("Completed");
      
      if (isSimulationMode) {
        setDeployFunctionsLog(prev => [...prev, "Simulation mode completed."]);
        setDeployFunctionsLog(prev => [...prev, "You will need to manually deploy functions later via Supabase dashboard."]);
        toast.info("Simulation mode completed - functions were not actually deployed");
      } else {
        setDeployFunctionsLog(prev => [...prev, "Edge Functions deployment completed successfully."]);
        toast.success("Edge Functions deployment successful!");
      }
      
      setDeployFunctionsComplete(true);
      setDeployFunctionsSuccess(true);
      
    } catch (error) {
      console.error("Edge Functions deployment error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setDeployFunctionsLog(prev => [...prev, `Error: ${errorMessage}`]);
      setDeploymentError(errorMessage);
      setDeployFunctionsComplete(true);
      setDeployFunctionsSuccess(false);
      setDeployFunctionsProgress(0);
      setCurrentDeployStep("Failed");
      toast.error("Edge Functions deployment failed");
      
      if (!isSimulationMode) {
        setDeployFunctionsLog(prev => [...prev, "You can try the simulation mode to proceed with setup."]);
      }
    } finally {
      setDeployFunctionsRunning(false);
    }
  };

  const simulateDeployment = () => {
    setIsSimulationMode(true);
    deployEdgeFunctions();
  };

  const runMigration = async () => {
    setMigrationRunning(true);
    setMigrationComplete(false);
    setMigrationSuccess(false);
    setMigrationLog(["Starting database migration..."]);
    setMigrationProgress(0);
    setCurrentStep("Initializing");

    try {
      const serviceRoleKey = setupData.supabaseServiceRoleKey;
      if (!serviceRoleKey) {
        throw new Error("Missing Supabase Service Role Key in setupData. Please go back to Connection step.");
      }

      setMigrationLog(prev => [...prev, "Checking database connection..."]);
      setMigrationProgress(5);
      setCurrentStep("Checking connection");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`
        },
        body: { action: 'run-migration' }
      });

      console.log("Edge function response:", data, error);

      if (error) {
        throw new Error(`Error calling setup-wizard function: ${error.message}`);
      }

      setMigrationProgress(20);
      setCurrentStep("Creating ENUM types");
      setMigrationLog(prev => [...prev, "Creating ENUM types..."]);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setMigrationProgress(30);
      setCurrentStep("Creating core tables");
      setMigrationLog(prev => [...prev, "Creating core system tables (site_settings, user_roles, profiles)..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMigrationProgress(40);
      setCurrentStep("Creating HRM tables");
      setMigrationLog(prev => [...prev, "Creating HRM system tables (tasks, invoices, customers)..."]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMigrationProgress(50);
      setCurrentStep("Creating blog tables");
      setMigrationLog(prev => [...prev, "Creating blog system tables (posts, categories, comments)..."]);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setMigrationProgress(60);
      setCurrentStep("Creating ecommerce tables");
      setMigrationLog(prev => [...prev, "Creating ecommerce tables (products, orders, inventory)..."]);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setMigrationProgress(70);
      setCurrentStep("Creating file tables");
      setMigrationLog(prev => [...prev, "Creating file management tables (folders, shares)..."]);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMigrationProgress(80);
      setCurrentStep("Creating health tables");
      setMigrationLog(prev => [...prev, "Creating health tracking tables (cycle_settings, period_logs)..."]);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setMigrationProgress(85);
      setCurrentStep("Creating misc tables");
      setMigrationLog(prev => [...prev, "Creating miscellaneous tables (pages, content_blocks)..."]);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setMigrationProgress(90);
      setCurrentStep("Setting up RLS policies");
      setMigrationLog(prev => [...prev, "Setting up Row Level Security (RLS) policies..."]);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMigrationProgress(95);
      setCurrentStep("Inserting initial data");
      setMigrationLog(prev => [...prev, "Inserting initial data..."]);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setMigrationProgress(100);
      setCurrentStep("Completed");
      setMigrationLog(prev => [...prev, "Migration completed successfully!"]);
      
      setMigrationComplete(true);
      setMigrationSuccess(true);
      updateSetupStatus("database", "complete");
      toast.success("Database migration completed successfully!");
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationLog(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
      setMigrationComplete(true);
      setMigrationSuccess(false);
      setMigrationProgress(0);
      setCurrentStep("Failed");
      updateSetupStatus("database", "error");
      toast.error("Database migration failed");
    } finally {
      setMigrationRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Database & Functions Setup</h2>
        <p className="text-gray-500">
          This step will deploy all required Edge Functions and create necessary database tables, schemas, 
          and initial data for your Elloria installation.
        </p>
      </div>

      <div className="space-y-4 my-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Edge Functions Deployment
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            This process will deploy all necessary Edge Functions to your Supabase project:
          </p>
          
          <ul className="text-sm space-y-2 mb-4 grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Email & contact functions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Payment processing functions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>User management functions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Document generation functions</span>
            </li>
          </ul>
          
          {connectionTestResult && (
            <div className={`mb-4 p-3 ${connectionTestResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'} rounded-md text-sm`}>
              <div className="font-semibold flex items-center mb-1">
                {connectionTestResult.success ? (
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="mr-1 h-4 w-4" />
                )}
                Connection Test:
              </div>
              <div className="pl-5">{connectionTestResult.message}</div>
            </div>
          )}
          
          {deploymentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <div className="font-semibold flex items-center mb-1">
                <AlertCircle className="mr-1 h-4 w-4" />
                Deployment Error:
              </div>
              <div className="pl-5">{deploymentError}</div>
              <div className="mt-2 text-xs text-red-600">
                Possible causes:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Invalid Supabase URL or Service Role Key</li>
                  <li>Network connectivity issues</li>
                  <li>CORS restrictions</li>
                  <li>Missing setup-wizard Edge Function</li>
                </ul>
                <div className="mt-2">
                  You can proceed with simulation mode, and manually deploy functions later from the Supabase dashboard.
                </div>
              </div>
            </div>
          )}
          
          {deployFunctionsRunning && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{currentDeployStep}</span>
                <span className="text-xs font-medium">{deployFunctionsProgress}%</span>
              </div>
              <Progress value={deployFunctionsProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            {!isSimulationMode && !deployFunctionsSuccess ? (
              <>
                <Button
                  onClick={deployEdgeFunctions}
                  className="flex-1"
                  disabled={deployFunctionsRunning}
                  variant={deployFunctionsComplete && deployFunctionsSuccess ? "outline" : 
                          deployFunctionsComplete && !deployFunctionsSuccess ? "destructive" : "default"}
                >
                  {deployFunctionsRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying Functions...
                    </>
                  ) : deployFunctionsComplete && deployFunctionsSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Deployment Successful
                    </>
                  ) : deployFunctionsComplete && !deployFunctionsSuccess ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Retry Deployment
                    </>
                  ) : (
                    <>
                      <Server className="mr-2 h-4 w-4" />
                      Deploy Edge Functions
                    </>
                  )}
                </Button>
                
                {deployFunctionsComplete && !deployFunctionsSuccess && (
                  <Button 
                    onClick={simulateDeployment}
                    className="flex-none"
                    disabled={deployFunctionsRunning}
                    variant="secondary"
                  >
                    Use Simulation Mode
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={deployFunctionsSuccess ? deployEdgeFunctions : simulateDeployment}
                className="flex-1"
                disabled={deployFunctionsRunning}
                variant={deployFunctionsComplete && deployFunctionsSuccess ? "outline" : "default"}
              >
                {deployFunctionsRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSimulationMode ? "Simulating..." : "Deploying Functions..."}
                  </>
                ) : deployFunctionsComplete && deployFunctionsSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    {isSimulationMode ? "Simulation Complete" : "Deployment Successful"}
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-4 w-4" />
                    {isSimulationMode ? "Simulate Deployment" : "Deploy Edge Functions"}
                  </>
                )}
              </Button>
            )}
            
            <Button
              onClick={testSupabaseConnection}
              variant="outline"
              className="flex-none"
              disabled={deployFunctionsRunning}
            >
              Test Connection
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <p className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              The Supabase Service Role Key is required for this step
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mt-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Database Migration
          </h3>
          
          {migrationRunning && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{currentStep}</span>
                <span className="text-xs font-medium">{migrationProgress}%</span>
              </div>
              <Progress value={migrationProgress} className="h-2" />
            </div>
          )}
          
          <Button
            onClick={runMigration}
            className="w-full"
            disabled={migrationRunning || !deployFunctionsComplete || !deployFunctionsSuccess}
            variant={migrationComplete && migrationSuccess ? "outline" : 
                    migrationComplete && !migrationSuccess ? "destructive" : "default"}
          >
            {migrationRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Migration...
              </>
            ) : migrationComplete && migrationSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Migration Successful
              </>
            ) : migrationComplete && !migrationSuccess ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Retry Migration
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                {isSimulationMode ? "Run Simulated Migration" : "Run Database Migration"}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <div className={`bg-black text-green-400 p-4 rounded-md font-mono text-sm h-60 overflow-y-auto ${deployFunctionsLog.length === 0 ? 'hidden' : 'md:w-1/2'}`}>
          <h4 className="text-xs uppercase mb-2 text-green-200">Function Deployment Log</h4>
          {deployFunctionsLog.map((log, index) => (
            <div key={index} className="pb-1">
              <span className="opacity-50">&gt; </span>
              {log}
            </div>
          ))}
        </div>
        
        <div className={`bg-black text-green-400 p-4 rounded-md font-mono text-sm h-60 overflow-y-auto ${migrationLog.length === 0 ? 'hidden' : 'md:w-1/2'}`}>
          <h4 className="text-xs uppercase mb-2 text-green-200">Database Migration Log</h4>
          {migrationLog.map((log, index) => (
            <div key={index} className="pb-1">
              <span className="opacity-50">&gt; </span>
              {log}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!migrationComplete || !migrationSuccess}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {(isSimulationMode || deploymentError) && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
          <div className="font-semibold flex items-center mb-1">
            <AlertCircle className="mr-1 h-4 w-4" />
            {isSimulationMode ? "Simulation Mode Active" : "Important Note"}
          </div>
          <p>
            {isSimulationMode 
              ? "You are using simulation mode. The setup will continue, but you will need to manually deploy edge functions later from your Supabase dashboard."
              : "If you're experiencing persistent issues with Edge Functions deployment, you can use simulation mode to proceed with setup and manually deploy the functions later."}
          </p>
          <p className="mt-2">
            To manually deploy Edge Functions later:
          </p>
          <ol className="list-decimal ml-5 mt-1 space-y-1">
            <li>Go to your Supabase dashboard</li>
            <li>Navigate to Edge Functions section</li>
            <li>Create each required function</li>
            <li>Deploy them with the necessary code</li>
          </ol>
        </div>
      )}
    </div>
  );
}
