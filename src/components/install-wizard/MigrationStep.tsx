
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, Loader2, Download } from "lucide-react";
import { runMigration, generateCompleteMigrationSql } from "@/utils/migration";

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
  const [log, setLog] = useState<Array<{ message: string; type: "info" | "success" | "error" }>>([]);
  const [sqlDownloadUrl, setSqlDownloadUrl] = useState<string | null>(null);

  // Generate SQL script URL on component mount
  useEffect(() => {
    const sqlScript = generateCompleteMigrationSql();
    const blob = new Blob([sqlScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setSqlDownloadUrl(url);
    
    // Clean up URL on unmount
    return () => {
      if (sqlDownloadUrl) {
        URL.revokeObjectURL(sqlDownloadUrl);
      }
    };
  }, []);

  const startMigration = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setLog([{ message: "Starting migration process...", type: "info" }]);
    setMigrationState({
      completed: false,
      progress: 0,
      currentTask: "Initializing...",
      errors: [],
    });

    try {
      // Make sure the URL has a protocol
      let supabaseUrl = config.url;
      if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
        supabaseUrl = 'https://' + supabaseUrl;
      }
      
      // Create a client with the provided config
      // This is important - we need to create a new client with the service role key
      const supabase = createClient(supabaseUrl, config.key, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        }
      });
      
      // Store configuration for future use
      try {
        localStorage.setItem('supabase_config', JSON.stringify(config));
      } catch (e) {
        console.error("Error storing config:", e);
      }
      
      // Create SQL script download option
      const sqlScript = generateCompleteMigrationSql();
      const blob = new Blob([sqlScript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setSqlDownloadUrl(url);
      
      // Run the migration with the Supabase client
      await runMigration(supabase, {
        onProgress: (progress, task) => {
          setMigrationState(prev => ({
            ...prev,
            progress,
            currentTask: task
          }));
          setLog(prev => [...prev, { message: task, type: "info" }]);
        },
        onSuccess: (message) => {
          setLog(prev => [...prev, { message, type: "success" }]);
        },
        onError: (error) => {
          setMigrationState(prev => ({
            ...prev,
            errors: [...prev.errors, error]
          }));
          setLog(prev => [...prev, { message: error, type: "error" }]);
        }
      });

      // Mark the migration as complete only if no errors occurred
      if (migrationState.errors.length === 0) {
        setMigrationState(prev => ({
          ...prev,
          completed: true,
          progress: 100,
          currentTask: "Migration completed successfully!"
        }));
        
        setLog(prev => [...prev, { 
          message: "Migration completed successfully!", 
          type: "success" 
        }]);
      } else {
        setMigrationState(prev => ({
          ...prev,
          progress: 100,
          currentTask: "Migration completed with errors. Check the logs for details."
        }));
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMigrationState(prev => ({
        ...prev,
        errors: [...prev.errors, errorMessage]
      }));
      
      setLog(prev => [...prev, { 
        message: `Migration failed: ${errorMessage}`, 
        type: "error" 
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Database Migration
        </h2>
        <p className="mt-2 text-gray-600">
          Set up all required database tables and initial data
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg text-gray-900 mb-2">
          The migration will:
        </h3>
        <ul className="space-y-1 text-gray-600 list-disc pl-5">
          <li>Create all database tables needed for the CMS</li>
          <li>Set up proper security policies (RLS)</li>
          <li>Create necessary database functions</li>
          <li>Configure essential enums and types</li>
          <li>Set up initial data for configuration</li>
        </ul>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-amber-800 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>
            <strong>Warning:</strong> This will create new tables in your Supabase project. 
            If tables with the same names already exist, this might cause conflicts. 
            It's best to start with a fresh Supabase project.
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {!migrationState.completed && !isRunning && (
          <div className="space-y-4">
            <Button 
              onClick={startMigration} 
              className="w-full"
              disabled={isRunning}
            >
              Start Database Migration
            </Button>
            
            {sqlDownloadUrl && (
              <div className="flex justify-center">
                <a 
                  href={sqlDownloadUrl} 
                  download="supabase_cms_migration.sql"
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download SQL Script (for manual execution)
                </a>
              </div>
            )}
          </div>
        )}

        {(isRunning || migrationState.progress > 0) && (
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
                      : "text-gray-300"
                }`}
              >
                {entry.type === "error" && <XCircle className="inline-block mr-1 h-4 w-4" />}
                {entry.type === "success" && <CheckCircle className="inline-block mr-1 h-4 w-4" />}
                {entry.message}
              </div>
            ))
          )}
        </div>

        {migrationState.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-semibold mb-1">Errors occurred during migration:</div>
              <ul className="list-disc pl-5 space-y-1">
                {migrationState.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
              {sqlDownloadUrl && (
                <div className="mt-4">
                  <p className="text-sm text-red-800 mb-2">
                    Automatic migration failed. You can manually run the SQL script in the Supabase SQL Editor:
                  </p>
                  <a 
                    href={sqlDownloadUrl} 
                    download="supabase_cms_migration.sql"
                    className="flex items-center text-sm font-medium text-red-800 hover:text-red-700 bg-red-50 py-2 px-3 rounded-md inline-block"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download SQL Script
                  </a>
                </div>
              )}
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
        
        <div className="flex space-x-2">
          {sqlDownloadUrl && !isRunning && (
            <a 
              href={sqlDownloadUrl} 
              download="supabase_cms_migration.sql"
              className="flex items-center text-sm font-medium bg-blue-50 border border-blue-300 text-blue-700 hover:bg-blue-100 py-2 px-4 rounded-md"
            >
              <Download className="h-4 w-4 mr-2" />
              Download SQL
            </a>
          )}
          
          <Button 
            onClick={onNext} 
            disabled={!migrationState.completed && !migrationState.errors.length || isRunning}
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
    </div>
  );
}
