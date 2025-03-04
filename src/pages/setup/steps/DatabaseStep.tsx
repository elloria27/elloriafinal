
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Database, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const runMigration = async () => {
    setMigrationRunning(true);
    setMigrationComplete(false);
    setMigrationSuccess(false);
    setMigrationLog(["Starting database migration..."]);

    try {
      // Add log entries
      setMigrationLog(prev => [...prev, "Checking database connection..."]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating wait time
      
      setMigrationLog(prev => [...prev, "Creating database tables and schemas..."]);
      
      // Call the setup-wizard function
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        body: { action: 'run-migration' }
      });

      console.log("Response from setup-wizard function:", data, error);

      if (error) {
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Unknown error occurred");
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating wait time
      
      setMigrationLog(prev => [...prev, "Setting up default data..."]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating wait time
      
      setMigrationLog(prev => [...prev, "Configuring security policies..."]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating wait time
      
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
      updateSetupStatus("database", "error");
      toast.error("Database migration failed");
    } finally {
      setMigrationRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Database Setup</h2>
        <p className="text-gray-500">
          This step will create all necessary database tables, schemas, and initial data
          for your Elloria installation.
        </p>
      </div>

      <div className="space-y-4 my-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Database Migration
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            This process will set up the following:
          </p>
          
          <ul className="text-sm space-y-2 mb-4">
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Create site_settings table</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Create user_roles table for permissions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Configure Row-Level Security policies</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
              <span>Set up default site settings</span>
            </li>
          </ul>
          
          <Button
            onClick={runMigration}
            className="w-full"
            disabled={migrationRunning}
            variant={migrationComplete && migrationSuccess ? "outline" : "default"}
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
                <RotateCw className="mr-2 h-4 w-4" />
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
        
        {migrationLog.length > 0 && (
          <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-60 overflow-y-auto">
            {migrationLog.map((log, index) => (
              <div key={index} className="pb-1">
                <span className="opacity-50">&gt; </span>
                {log}
              </div>
            ))}
          </div>
        )}
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
