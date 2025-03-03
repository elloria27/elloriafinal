
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Download, AlertTriangle, ExternalLink, Upload } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

interface MigrationStepProps {
  config: {
    url: string;
    key: string;
    projectId: string;
  };
  migrationState: {
    completed: boolean;
    progress: number;
    currentTask: string;
    errors: string[];
  };
  setMigrationState: React.Dispatch<
    React.SetStateAction<{
      completed: boolean;
      progress: number;
      currentTask: string;
      errors: string[];
    }>
  >;
  onNext: () => void;
  onBack: () => void;
}

export function MigrationStep({
  config,
  migrationState,
  setMigrationState,
  onNext,
  onBack,
}: MigrationStepProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<Array<{ message: string; type: "info" | "success" | "error" | "warning" }>>([]);
  const [databaseBackupUrl, setDatabaseBackupUrl] = useState<string | null>(null);
  const [manualModeActive, setManualModeActive] = useState(true); // Default to manual mode now
  const [manualSteps, setManualSteps] = useState<string[]>([]);

  // Generate backup file URL on component mount
  useEffect(() => {
    // Create URL for the database backup file
    const backupFileUrl = '/src/utils/db_cluster-02-03-2025@08-03-16.backup';
    setDatabaseBackupUrl(backupFileUrl);
    
    // Prepare manual steps
    setManualSteps([
      "Download the database backup file",
      "Login to your Supabase dashboard at https://supabase.com/dashboard",
      `Open your project "${config.projectId}"`,
      "Go to the 'Database' section from the left sidebar",
      "Click on 'Backups'",
      "Select 'Import from file'",
      "Upload the downloaded database backup file",
      "Wait for the import to complete",
      "Once completed, return here and click 'I've completed the database import'"
    ]);
    
    // Log initial information
    setLog([
      { 
        message: "Database migration requires importing a database backup file.", 
        type: "info" 
      },
      { 
        message: "Please follow the manual import steps listed below.", 
        type: "info" 
      }
    ]);
    
    // Store configuration for future use
    try {
      localStorage.setItem('supabase_config', JSON.stringify(config));
    } catch (e) {
      console.error("Error storing config:", e);
    }
  }, [config.projectId]);

  const handleManualMigrationSuccess = () => {
    // Update migration state to completed
    setMigrationState({
      completed: true,
      progress: 100,
      currentTask: "Database import completed successfully",
      errors: []
    });
    
    // Add success message to log
    setLog(prev => [...prev, { 
      message: "Database import reported as successful", 
      type: "success" 
    }]);
    
    // Show success toast
    toast.success("Database import completed successfully");
  };

  const openSupabaseDashboard = () => {
    const dashboardUrl = `https://supabase.com/dashboard/project/${config.projectId}/database/backups`;
    window.open(dashboardUrl, '_blank');
    
    // Log this action
    setLog(prev => [...prev, { 
      message: "Opened Supabase dashboard", 
      type: "info" 
    }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Database Setup
        </h2>
        <p className="mt-2 text-gray-600">
          Import the database backup to set up all required tables and initial data
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg text-gray-900 mb-2">
          The database backup contains:
        </h3>
        <ul className="space-y-1 text-gray-600 list-disc pl-5">
          <li>All database tables needed for the CMS</li>
          <li>Proper security policies (RLS)</li>
          <li>Required database functions</li>
          <li>Essential enums and types</li>
          <li>Initial data for configuration</li>
        </ul>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-amber-800 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Important:</strong> This will import a complete database structure into your Supabase project. 
            If you already have tables with the same names, their data will be replaced.
            It's best to start with a fresh Supabase project.
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {/* Manual migration instructions - always shown by default now */}
        <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800">Database Import Instructions</h3>
          <p className="text-blue-700 text-sm">
            Follow these steps to manually import the database backup in the Supabase dashboard:
          </p>
          
          <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-2">
            {manualSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          
          <div className="flex flex-col space-y-3">
            {databaseBackupUrl && (
              <a 
                href={databaseBackupUrl} 
                download="db_cluster-02-03-2025.backup"
                className="flex items-center justify-center text-sm font-medium bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Database Backup
              </a>
            )}
            
            <Button 
              variant="outline"
              className="flex items-center justify-center text-blue-700 border-blue-300"
              onClick={openSupabaseDashboard}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase Dashboard
            </Button>
            
            <Button 
              onClick={handleManualMigrationSuccess}
              variant="outline"
              className="text-blue-700 border-blue-300"
            >
              I've completed the database import
            </Button>
          </div>
        </div>

        {migrationState.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{migrationState.currentTask}</span>
              <span>{Math.round(migrationState.progress)}%</span>
            </div>
            <Progress value={migrationState.progress} className="h-2" />
          </div>
        )}

        <div className="border rounded-md h-64 overflow-y-auto bg-black text-gray-200 p-4 font-mono text-sm">
          {log.length === 0 ? (
            <div className="text-gray-500 italic">Migration logs will appear here...</div>
          ) : (
            log.map((entry, index) => (
              <div 
                key={index} 
                className={`mb-1 ${
                  entry.type === "error" 
                    ? "text-red-400" 
                    : entry.type === "success" 
                      ? "text-green-400" 
                      : entry.type === "warning"
                        ? "text-yellow-400"
                        : "text-gray-300"
                }`}
              >
                {entry.type === "error" && <XCircle className="inline-block mr-1 h-4 w-4" />}
                {entry.type === "success" && <CheckCircle className="inline-block mr-1 h-4 w-4" />}
                {entry.type === "warning" && <AlertTriangle className="inline-block mr-1 h-4 w-4" />}
                {entry.message}
              </div>
            ))
          )}
        </div>

        {migrationState.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-semibold mb-1">Errors occurred during the process:</div>
              <ul className="list-disc pl-5 space-y-1">
                {migrationState.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Separator />
      
      <div className="flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline" 
          disabled={isRunning}
        >
          Back
        </Button>
        
        <Button 
          onClick={onNext} 
          disabled={!migrationState.completed || isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Next: Admin Setup"
          )}
        </Button>
      </div>
    </div>
  );
}
