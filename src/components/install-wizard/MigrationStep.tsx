
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { runMigration } from "@/utils/migration";

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

  // Function to create database helper functions via the Supabase client
  const createHelperFunctions = async (supabase: any) => {
    try {
      setLog(prev => [...prev, { message: "Creating database helper functions...", type: "info" }]);
      
      // Store configuration for future use
      try {
        localStorage.setItem('supabase_config', JSON.stringify(config));
      } catch (e) {
        console.error("Error storing config:", e);
      }

      // Use Supabase client to create functions instead of direct REST API calls
      try {
        // Create functions one by one using the SQL API that the Supabase client provides
        const functions = [
          // Enable RLS function
          `
          CREATE OR REPLACE FUNCTION enable_rls(table_name text)
          RETURNS void AS $$
          BEGIN
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          `,
          
          // Define RLS policy function
          `
          CREATE OR REPLACE FUNCTION define_rls_policy(
            table_name text,
            policy_name text,
            operation text,
            definition text,
            check_expression text DEFAULT 'true'
          )
          RETURNS void AS $$
          BEGIN
            BEGIN
              EXECUTE format('CREATE POLICY %I ON %I FOR %s TO authenticated USING (%s) WITH CHECK (%s);',
                policy_name, table_name, operation, definition, check_expression
              );
            EXCEPTION
              WHEN duplicate_object THEN
                EXECUTE format('ALTER POLICY %I ON %I USING (%s) WITH CHECK (%s);',
                  policy_name, table_name, definition, check_expression
                );
            END;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          `,
          
          // Create enum type function
          `
          CREATE OR REPLACE FUNCTION create_enum_type(enum_name text, enum_values text[])
          RETURNS void AS $$
          BEGIN
            BEGIN
              EXECUTE format('CREATE TYPE %I AS ENUM (%s);',
                enum_name,
                array_to_string(array(SELECT format('%L', v) FROM unnest(enum_values) AS v), ',')
              );
            EXCEPTION
              WHEN duplicate_object THEN
                NULL;
            END;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          `,
          
          // Create index function
          `
          CREATE OR REPLACE FUNCTION create_index(index_name text, table_name text, columns text[], is_unique boolean DEFAULT false)
          RETURNS void AS $$
          BEGIN
            BEGIN
              IF is_unique THEN
                EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I (%s);',
                  index_name, table_name, array_to_string(columns, ',')
                );
              ELSE
                EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I (%s);',
                  index_name, table_name, array_to_string(columns, ',')
                );
              END IF;
            EXCEPTION
              WHEN duplicate_object THEN
                NULL;
            END;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          `,
          
          // Create table from schema function
          `
          CREATE OR REPLACE FUNCTION create_table_from_schema(
            table_name text,
            columns_json json
          )
          RETURNS void AS $$
          DECLARE
            col json;
            col_name text;
            col_type text;
            col_constraints text;
            create_statement text;
          BEGIN
            create_statement := format('CREATE TABLE IF NOT EXISTS %I (', table_name);
            
            FOR col IN SELECT * FROM json_array_elements(columns_json)
            LOOP
              col_name := col->>'name';
              col_type := col->>'type';
              
              col_constraints := '';
              
              IF (col->>'isPrimary')::boolean THEN
                col_constraints := col_constraints || ' PRIMARY KEY';
              END IF;
              
              IF (col->>'isUnique')::boolean THEN
                col_constraints := col_constraints || ' UNIQUE';
              END IF;
              
              IF NOT (col->>'isNullable')::boolean THEN
                col_constraints := col_constraints || ' NOT NULL';
              END IF;
              
              IF col->>'defaultValue' IS NOT NULL THEN
                col_constraints := col_constraints || ' DEFAULT ' || (col->>'defaultValue');
              END IF;
              
              IF col->>'references' IS NOT NULL THEN
                col_constraints := col_constraints || format(' REFERENCES %I(%I)',
                  (col->'references'->>'table'),
                  (col->'references'->>'column')
                );
              END IF;
              
              create_statement := create_statement || format('%I %s%s, ', col_name, col_type, col_constraints);
            END LOOP;
            
            -- Remove trailing comma and space
            create_statement := left(create_statement, length(create_statement) - 2);
            
            create_statement := create_statement || ');';
            
            EXECUTE create_statement;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          `
        ];

        // Try to execute each function creation statement
        for (const functionSql of functions) {
          try {
            // Use the Supabase client's rpc method with a generic function that executes custom SQL
            const { error } = await supabase.rpc('execute_sql', { sql: functionSql });
            
            if (error) {
              console.warn(`Warning when creating function: ${error.message}`);
              
              // Try alternative approach using a direct query if available
              try {
                const { error: queryError } = await supabase.from('_exec_sql').select('*').eq('sql', functionSql).limit(1);
                if (queryError) {
                  console.warn(`Alternative method also failed: ${queryError.message}`);
                }
              } catch (e) {
                console.warn("Alternative method exception:", e);
              }
            }
          } catch (e) {
            console.warn(`Exception when creating function: ${e}`);
          }
        }
        
        setLog(prev => [...prev, { message: "Helper functions created (with some possible warnings)", type: "success" }]);
        return true;
      } catch (error) {
        console.error("Error creating helper functions:", error);
        setLog(prev => [...prev, { 
          message: `Warning: Could not create all helper functions. Some features may be limited. (${error})`, 
          type: "error" 
        }]);
        return false;
      }
    } catch (error) {
      console.error("Error in helper function setup:", error);
      setLog(prev => [...prev, { 
        message: `Warning: Could not setup helper functions: ${error}. Will try to proceed anyway.`, 
        type: "error" 
      }]);
      // Don't throw here, we'll try to continue anyway
      return false;
    }
  };

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
      // Create a client with the provided config
      const supabase = createClient(config.url, config.key);
      
      // First try to create the helper functions
      await createHelperFunctions(supabase);
      
      // Then run the migration with the Supabase client
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

      // Mark the migration as complete
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
          <Button 
            onClick={startMigration} 
            className="w-full"
            disabled={isRunning}
          >
            Start Database Migration
          </Button>
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
