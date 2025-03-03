
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
  const [manualModeActive, setManualModeActive] = useState(false);
  const [manualSteps, setManualSteps] = useState<string[]>([]);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [backupFileContent, setBackupFileContent] = useState<ArrayBuffer | null>(null);

  // Initialize Supabase client and backup file on component mount
  useEffect(() => {
    try {
      // Create URL for the database backup file
      const backupFileUrl = '/src/utils/db_cluster-02-03-2025@08-03-16.backup';
      setDatabaseBackupUrl(backupFileUrl);
      
      // Initialize Supabase client with the provided configuration
      const supabase = createClient(config.url, config.key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      setSupabaseClient(supabase);

      // Prepare manual steps as fallback
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
      
      // Load backup file content
      fetch(backupFileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch backup file: ${response.status} ${response.statusText}`);
          }
          return response.arrayBuffer();
        })
        .then(data => {
          setBackupFileContent(data);
          setLog(prev => [...prev, { 
            message: "Database backup file loaded successfully", 
            type: "success" 
          }]);
        })
        .catch(error => {
          console.error("Error loading backup file:", error);
          setLog(prev => [...prev, { 
            message: `Error loading backup file: ${error.message}`, 
            type: "error" 
          }]);
        });
      
      // Store configuration for future use
      try {
        localStorage.setItem('supabase_config', JSON.stringify(config));
      } catch (e) {
        console.error("Error storing config:", e);
      }
      
      // Initial log message
      setLog([
        { 
          message: "Ready to import database backup. Click 'Start Import' to begin.", 
          type: "info" 
        }
      ]);
    } catch (error) {
      console.error("Initialization error:", error);
      setLog([{ 
        message: `Initialization error: ${error instanceof Error ? error.message : String(error)}`, 
        type: "error" 
      }]);
    }
  }, [config]);

  const startAutomaticImport = async () => {
    if (!supabaseClient || !backupFileContent) {
      toast.error("Cannot start import: Supabase client or backup file not ready");
      setLog(prev => [...prev, { 
        message: "Cannot start import: Supabase client or backup file not ready", 
        type: "error" 
      }]);
      return;
    }

    setIsRunning(true);
    setMigrationState(prev => ({
      ...prev,
      progress: 10,
      currentTask: "Starting database import..."
    }));

    try {
      // Convert ArrayBuffer to Blob
      const backupBlob = new Blob([backupFileContent], { type: 'application/octet-stream' });
      
      // Create a File object from the Blob
      const backupFile = new File([backupBlob], "db_cluster-02-03-2025.backup", { type: 'application/octet-stream' });
      
      setLog(prev => [...prev, { message: "Preparing database import...", type: "info" }]);
      setMigrationState(prev => ({
        ...prev,
        progress: 20,
        currentTask: "Preparing database import..."
      }));

      // Attempt to use the Supabase Storage API to upload the backup file
      const { data: uploadData, error: uploadError } = await supabaseClient
        .storage
        .from('database-backups')
        .upload(`import-${Date.now()}.backup`, backupFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Failed to upload backup: ${uploadError.message}`);
      }

      setLog(prev => [...prev, { message: "Backup file uploaded, initiating import...", type: "info" }]);
      setMigrationState(prev => ({
        ...prev,
        progress: 40,
        currentTask: "Backup file uploaded, initiating import..."
      }));

      // Try to call a custom database import RPC function (note: this would need to be set up in Supabase)
      const { data: importData, error: importError } = await supabaseClient
        .rpc('import_database_backup', { file_path: uploadData.path });

      if (importError) {
        // If automatic import fails, suggest manual method
        setLog(prev => [...prev, { 
          message: `Automatic import failed: ${importError.message}. Please try manual import.`, 
          type: "error" 
        }]);
        setManualModeActive(true);
        throw new Error(`Failed to import database: ${importError.message}`);
      }

      // Simulate progress with a delay (in a real implementation, you would poll for actual progress)
      for (let progress = 50; progress <= 90; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMigrationState(prev => ({
          ...prev,
          progress,
          currentTask: `Importing database (${progress}% complete)...`
        }));
      }

      // Verify the import was successful by checking for a table
      const { data: verifyData, error: verifyError } = await supabaseClient
        .from('pages')
        .select('id')
        .limit(1);

      if (verifyError) {
        throw new Error(`Failed to verify import: ${verifyError.message}`);
      }

      // Successful import
      setLog(prev => [...prev, { message: "Database import completed successfully!", type: "success" }]);
      setMigrationState({
        completed: true,
        progress: 100,
        currentTask: "Database import completed successfully!",
        errors: []
      });
      toast.success("Database import completed successfully!");
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      setLog(prev => [...prev, { 
        message: `Import error: ${errorMessage}. Switching to manual import mode.`, 
        type: "error" 
      }]);
      
      // Add errors to migration state
      setMigrationState(prev => ({
        ...prev,
        progress: 0,
        currentTask: "Import failed. Please try manual import.",
        errors: [...prev.errors, errorMessage]
      }));
      
      // Switch to manual mode
      setManualModeActive(true);
      toast.error("Automatic import failed. Please follow manual import steps.");
    } finally {
      setIsRunning(false);
    }
  };

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
        {/* Automatic import section - shown by default */}
        {!manualModeActive && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800">Automatic Database Import</h3>
            <p className="text-blue-700 text-sm">
              Click the button below to automatically import the database structure into your Supabase project.
            </p>
            
            <Button 
              onClick={startAutomaticImport}
              disabled={isRunning || !backupFileContent || migrationState.completed}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing Database...
                </>
              ) : migrationState.completed ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Import Completed
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Start Import
                </>
              )}
            </Button>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setManualModeActive(true)}
                className="text-xs"
              >
                Switch to Manual Import
              </Button>
              
              {databaseBackupUrl && (
                <a 
                  href={databaseBackupUrl} 
                  download="db_cluster-02-03-2025.backup"
                  className="inline-flex items-center text-xs font-medium bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Backup
                </a>
              )}
            </div>
          </div>
        )}

        {/* Manual migration instructions - shown when automatic fails or user chooses manual */}
        {manualModeActive && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800">Manual Database Import</h3>
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
              
              {!migrationState.completed && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setManualModeActive(false)}
                  className="text-xs"
                >
                  Try Automatic Import
                </Button>
              )}
            </div>
          </div>
        )}

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
