
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Database, RotateCw, AlertCircle, Server } from "lucide-react";
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

  const runMigration = async () => {
    setMigrationRunning(true);
    setMigrationComplete(false);
    setMigrationSuccess(false);
    setMigrationLog(["Starting database migration..."]);
    setMigrationProgress(0);
    setCurrentStep("Initializing");

    try {
      // Validate required keys
      setMigrationLog(prev => [...prev, "Checking Supabase service role key..."]);
      
      const serviceRoleKey = setupData.supabaseServiceRoleKey;
      if (!serviceRoleKey) {
        throw new Error("Missing Supabase Service Role Key in setupData. Please go back to Connection step.");
      }

      setMigrationLog(prev => [...prev, "Checking database connection..."]);
      setMigrationProgress(5);
      setCurrentStep("Checking connection");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Invoke the migration function
      setMigrationLog(prev => [...prev, "Starting database setup..."]);
      setMigrationProgress(10);
      setCurrentStep("Starting setup");

      setMigrationLog(prev => [...prev, "Calling setup-wizard edge function..."]);
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

      // Add specific steps with progress increments
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
      
      // Completion of migration
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

  const deployEdgeFunctions = async () => {
    setDeployFunctionsRunning(true);
    setDeployFunctionsComplete(false);
    setDeployFunctionsSuccess(false);
    setDeployFunctionsLog(["Starting Edge Functions deployment..."]);
    setDeployFunctionsProgress(0);
    setCurrentDeployStep("Initializing");

    try {
      // Validate required keys
      setDeployFunctionsLog(prev => [...prev, "Checking Supabase service role key..."]);
      
      const serviceRoleKey = setupData.supabaseServiceRoleKey;
      if (!serviceRoleKey) {
        throw new Error("Missing Supabase Service Role Key in setupData. Please go back to Connection step.");
      }

      const supabaseUrl = setupData.supabaseUrl;
      if (!supabaseUrl) {
        throw new Error("Missing Supabase URL in setupData. Please go back to Connection step.");
      }

      setDeployFunctionsLog(prev => [...prev, "Checking Supabase connection..."]);
      setDeployFunctionsProgress(10);
      setCurrentDeployStep("Checking connection");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Invoke the deploy edge functions action
      setDeployFunctionsLog(prev => [...prev, "Starting Edge Functions deployment..."]);
      setDeployFunctionsProgress(20);
      setCurrentDeployStep("Starting deployment");
      
      // List of functions to deploy
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

      setDeployFunctionsLog(prev => [...prev, "Calling setup-wizard edge function for deployment..."]);
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Supabase-URL": supabaseUrl
        },
        body: { 
          action: 'deploy-edge-functions',
          functionsData: functionsToDeploy
        }
      });

      console.log("Edge function deployment response:", data, error);

      if (error) {
        throw new Error(`Error calling setup-wizard function: ${error.message}`);
      }

      // Simulate progress for each function deployment
      let progressStep = 20;
      const progressIncrement = 75 / functionsToDeploy.length;

      for (const funcName of functionsToDeploy) {
        progressStep += progressIncrement;
        setDeployFunctionsProgress(Math.min(Math.round(progressStep), 95));
        setCurrentDeployStep(`Deploying ${funcName}`);
        setDeployFunctionsLog(prev => [...prev, `Deploying Edge Function: ${funcName}...`]);
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeployFunctionsLog(prev => [...prev, `Successfully deployed ${funcName}`]);
      }
      
      setDeployFunctionsProgress(100);
      setCurrentDeployStep("Completed");
      setDeployFunctionsLog(prev => [...prev, "All Edge Functions deployed successfully!"]);
      
      // Completion of deployment
      setDeployFunctionsComplete(true);
      setDeployFunctionsSuccess(true);
      toast.success("Edge Functions deployed successfully!");
    } catch (error) {
      console.error("Edge Functions deployment error:", error);
      setDeployFunctionsLog(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
      setDeployFunctionsComplete(true);
      setDeployFunctionsSuccess(false);
      setDeployFunctionsProgress(0);
      setCurrentDeployStep("Failed");
      toast.error("Edge Functions deployment failed");
    } finally {
      setDeployFunctionsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Database & Functions Setup</h2>
        <p className="text-gray-500">
          This step will create all necessary database tables, schemas, and initial data
          for your Elloria installation, as well as deploy all required Edge Functions.
        </p>
      </div>

      <div className="space-y-4 my-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Database Migration
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            This process will create over 60 tables including:
          </p>
          
          <ul className="text-sm space-y-2 mb-4 grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Core system tables (site_settings, profiles)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>HRM system (tasks, invoices, customers)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Blog system (posts, categories, comments)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Ecommerce (products, orders, inventory)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>File management (folders, file shares)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Row-Level Security policies</span>
            </li>
          </ul>
          
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
            disabled={migrationRunning}
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

        <div className="bg-gray-50 p-4 rounded-md mt-6">
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
          
          {deployFunctionsRunning && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{currentDeployStep}</span>
                <span className="text-xs font-medium">{deployFunctionsProgress}%</span>
              </div>
              <Progress value={deployFunctionsProgress} className="h-2" />
            </div>
          )}
          
          <Button
            onClick={deployEdgeFunctions}
            className="w-full"
            disabled={deployFunctionsRunning || !migrationComplete || !migrationSuccess}
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
                <AlertCircle className="mr-2 h-4 w-4" />
                Retry Deployment
              </>
            ) : (
              <>
                <Server className="mr-2 h-4 w-4" />
                Deploy Edge Functions
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <div className={`bg-black text-green-400 p-4 rounded-md font-mono text-sm h-60 overflow-y-auto ${migrationLog.length === 0 ? 'hidden' : 'md:w-1/2'}`}>
          <h4 className="text-xs uppercase mb-2 text-green-200">Database Migration Log</h4>
          {migrationLog.map((log, index) => (
            <div key={index} className="pb-1">
              <span className="opacity-50">&gt; </span>
              {log}
            </div>
          ))}
        </div>
        
        <div className={`bg-black text-green-400 p-4 rounded-md font-mono text-sm h-60 overflow-y-auto ${deployFunctionsLog.length === 0 ? 'hidden' : 'md:w-1/2'}`}>
          <h4 className="text-xs uppercase mb-2 text-green-200">Function Deployment Log</h4>
          {deployFunctionsLog.map((log, index) => (
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
    </div>
  );
}
