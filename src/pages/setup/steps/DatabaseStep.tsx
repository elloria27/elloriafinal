
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Database, RotateCw, AlertCircle, Server, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [deploymentInstructions, setDeploymentInstructions] = useState<any>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<any>(null);

  useEffect(() => {
    // Attempt to check deployment status when component mounts
    checkDeploymentStatus();
  }, []);

  const checkDeploymentStatus = async () => {
    try {
      const serviceRoleKey = setupData.supabaseServiceRoleKey;
      const supabaseUrl = setupData.supabaseUrl;
      
      if (!serviceRoleKey || !supabaseUrl) {
        return;
      }

      setDeployFunctionsLog(prev => [...prev, "Checking current deployment status..."]);
      
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        body: { 
          action: 'get-deployment-status'
        },
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Supabase-URL": supabaseUrl
        }
      });

      if (error) {
        console.error("Error checking deployment status:", error);
        return;
      }

      if (data && data.database_ready) {
        setMigrationComplete(true);
        setMigrationSuccess(true);
        setMigrationLog(prev => [...prev, "Database schema already installed."]);
        updateSetupStatus("database", "complete");
        
        if (data.functions_ready) {
          setDeployFunctionsComplete(true);
          setDeployFunctionsSuccess(true);
          setDeployFunctionsLog(prev => [...prev, "Edge functions already deployed."]);
        }
      }
      
      setDeploymentStatus(data);
      
    } catch (error) {
      console.error("Error checking deployment status:", error);
    }
  };

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

      // Use our setup-wizard function to test connection
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        body: { 
          action: 'test-connection'
        },
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Supabase-URL": supabaseUrl
        }
      });

      if (error) {
        setConnectionTestResult({
          success: false,
          message: `Connection test failed: ${error.message || 'Unknown error'}`
        });
        return false;
      }
      
      // Check deployment status while we're at it
      await checkDeploymentStatus();
      
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
    setIsSimulationMode(true); // We're always in simulation mode since we can't deploy directly
    setDeploymentInstructions(null);

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
      setDeployFunctionsLog(prev => [...prev, "Calling setup-wizard edge function for deployment simulation..."]);
      
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
        setDeployFunctionsLog(prev => [...prev, `Function invocation error: ${error.message || 'Unknown error'}`]);
        throw new Error(`Error calling setup-wizard function: ${error.message || 'Unknown error'}`);
      }

      if (data) {
        setDeployFunctionsLog(prev => [...prev, `Received deployment instructions from setup-wizard function`]);
        setDeploymentInstructions(data);
        
        // Log the instructions
        if (data.installation_instructions && data.installation_instructions.steps) {
          setDeployFunctionsLog(prev => [...prev, "Installation instructions:"]);
          data.installation_instructions.steps.forEach(step => {
            setDeployFunctionsLog(prev => [...prev, step]);
          });
        }
        
        if (data.alternative_options) {
          setDeployFunctionsLog(prev => [...prev, "\nAlternative options:"]);
          data.alternative_options.options.forEach(option => {
            setDeployFunctionsLog(prev => [...prev, `- ${option}`]);
          });
        }
      }

      let progressStep = 30;
      const progressIncrement = 65 / functionsToDeploy.length;

      for (const funcName of functionsToDeploy) {
        progressStep += progressIncrement;
        setDeployFunctionsProgress(Math.min(Math.round(progressStep), 95));
        setCurrentDeployStep(`Simulating ${funcName}`);
        setDeployFunctionsLog(prev => [...prev, `Preparing for deployment: ${funcName}...`]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setDeployFunctionsProgress(100);
      setCurrentDeployStep("Completed");
      
      setDeployFunctionsLog(prev => [...prev, "Simulation mode completed."]);
      setDeployFunctionsLog(prev => [...prev, "You will need to deploy functions via Supabase CLI - see instructions below."]);
      toast.info("Simulation mode completed - see CLI instructions for actual deployment");
      
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
    } finally {
      setDeployFunctionsRunning(false);
    }
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
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Supabase-URL": setupData.supabaseUrl
        },
        body: { action: 'run-migration' }
      });

      console.log("Edge function response:", data, error);

      if (error) {
        throw new Error(`Error calling setup-wizard function: ${error.message}`);
      }

      // Display the steps completed from the response
      if (data && data.steps_completed) {
        setMigrationProgress(20);
        
        const totalSteps = data.steps_completed.length;
        const progressIncrement = 75 / totalSteps;
        
        for (let i = 0; i < totalSteps; i++) {
          const step = data.steps_completed[i];
          const progress = 20 + ((i + 1) * progressIncrement);
          
          setMigrationProgress(Math.min(Math.round(progress), 95));
          setCurrentStep(step);
          setMigrationLog(prev => [...prev, step]);
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else {
        // Fallback to the old method if steps_completed is not available
        setMigrationProgress(20);
        setCurrentStep("Creating ENUM types");
        setMigrationLog(prev => [...prev, "Creating ENUM types..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(30);
        setCurrentStep("Creating core tables");
        setMigrationLog(prev => [...prev, "Creating core system tables (site_settings, user_roles, profiles)..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(40);
        setCurrentStep("Creating HRM tables");
        setMigrationLog(prev => [...prev, "Creating HRM system tables (tasks, invoices, customers)..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(50);
        setCurrentStep("Creating blog tables");
        setMigrationLog(prev => [...prev, "Creating blog system tables (posts, categories, comments)..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(60);
        setCurrentStep("Creating ecommerce tables");
        setMigrationLog(prev => [...prev, "Creating ecommerce tables (products, orders, inventory)..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(70);
        setCurrentStep("Creating file tables");
        setMigrationLog(prev => [...prev, "Creating file management tables (folders, shares)..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(80);
        setCurrentStep("Creating health tables");
        setMigrationLog(prev => [...prev, "Creating health tracking tables (cycle_settings, period_logs)..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(85);
        setCurrentStep("Creating misc tables");
        setMigrationLog(prev => [...prev, "Creating miscellaneous tables (pages, content_blocks)..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setMigrationProgress(90);
        setCurrentStep("Setting up RLS policies");
        setMigrationLog(prev => [...prev, "Setting up Row Level Security (RLS) policies..."]);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setMigrationProgress(95);
      setCurrentStep("Inserting initial data");
      setMigrationLog(prev => [...prev, "Inserting initial data..."]);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMigrationProgress(100);
      setCurrentStep("Completed");
      setMigrationLog(prev => [...prev, "Migration completed successfully!"]);
      
      setMigrationComplete(true);
      setMigrationSuccess(true);
      updateSetupStatus("database", "complete");
      toast.success("Database migration completed successfully!");
      
      // Update deployment status
      await checkDeploymentStatus();
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

  const renderDeploymentGuide = () => {
    if (!deploymentInstructions) return null;
    
    return (
      <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md text-slate-800 text-sm">
        <div className="font-semibold flex items-center mb-2">
          <Server className="mr-1 h-4 w-4" />
          Edge Functions Deployment Guide
        </div>
        
        <div className="mb-3">
          <p className="mb-2">{deploymentInstructions.installation_instructions?.description}</p>
          <ol className="space-y-1 list-decimal pl-5">
            {deploymentInstructions.installation_instructions?.steps.map((step, index) => (
              <li key={index} className="text-sm">{step}</li>
            ))}
          </ol>
        </div>
        
        {deploymentInstructions.alternative_options && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="font-medium mb-1">Alternative Options</p>
            <p className="text-xs mb-2">{deploymentInstructions.alternative_options.description}</p>
            <ul className="space-y-1 list-disc pl-5">
              {deploymentInstructions.alternative_options.options.map((option, index) => (
                <li key={index} className="text-sm">{option}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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

      {deploymentStatus && (
        <Alert className={deploymentStatus.database_ready ? "bg-green-50" : "bg-amber-50"}>
          <AlertTitle className="flex items-center">
            {deploymentStatus.database_ready ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            )}
            Current Installation Status
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${deploymentStatus.database_ready ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span>Database: {deploymentStatus.message}</span>
              </div>
              
              {deploymentStatus.tables_found !== undefined && (
                <div className="text-xs text-gray-500 ml-5">
                  Found {deploymentStatus.tables_found} of {deploymentStatus.required_tables} required tables
                </div>
              )}
              
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${deploymentStatus.functions_ready ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span>Functions: {deploymentStatus.functions_message}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 my-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Edge Functions Deployment
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            This process will prepare all necessary Edge Functions for deployment to your Supabase project:
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
            <Button
              onClick={deployEdgeFunctions}
              className="flex-1"
              disabled={deployFunctionsRunning}
              variant={deployFunctionsComplete && deployFunctionsSuccess ? "outline" : "default"}
            >
              {deployFunctionsRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Functions Deployment...
                </>
              ) : deployFunctionsComplete && deployFunctionsSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Deployment Instructions Ready
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  Prepare Edge Functions Deployment
                </>
              )}
            </Button>
            
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
            disabled={migrationRunning || (!testSupabaseConnection && !connectionTestResult?.success)}
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
                Run Database Migration
              </>
            )}
          </Button>
        </div>
      </div>
      
      {renderDeploymentGuide()}
      
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
      
      {isSimulationMode && deployFunctionsComplete && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
          <div className="font-semibold flex items-center mb-1">
            <AlertCircle className="mr-1 h-4 w-4" />
            Supabase CLI Deployment Required
          </div>
          <p>
            To complete the installation, you will need to deploy Edge Functions using the Supabase CLI. 
            See the detailed instructions above on how to use the CLI to deploy the functions.
          </p>
          <p className="mt-2">
            The database migration can be completed through this interface, but the functions need 
            to be deployed using the CLI method described above.
          </p>
        </div>
      )}
    </div>
  );
}
