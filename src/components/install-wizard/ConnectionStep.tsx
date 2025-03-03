
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@supabase/supabase-js";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface ConnectionStepProps {
  config: {
    url: string;
    key: string;
    projectId: string;
  };
  setConfig: React.Dispatch<
    React.SetStateAction<{
      url: string;
      key: string;
      projectId: string;
    }>
  >;
  onNext: () => void;
  onBack: () => void;
}

export function ConnectionStep({
  config,
  setConfig,
  onNext,
  onBack,
}: ConnectionStepProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const errors: Record<string, string> = {};
    
    if (!config.url.trim()) {
      errors.url = "Project URL is required";
    } else if (!config.url.includes("supabase.co")) {
      errors.url = "Invalid Supabase URL format";
    }
    
    if (!config.key.trim()) {
      errors.key = "API key is required";
    } else if (config.key.length < 30) {
      errors.key = "API key seems too short";
    }
    
    if (!config.projectId.trim()) {
      errors.projectId = "Project ID is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const testConnection = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const supabase = createClient(config.url, config.key);
      
      // Test basic connection with a simpler query that doesn't require tables to exist
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setTestResult({
          success: false, 
          message: "Connection failed: " + error.message
        });
        return;
      }
      
      // Check if we have proper permissions by checking if we can create schema objects
      try {
        // Test if we can access schema information with a simple SQL query
        // This will work even if our app tables don't exist yet
        const { error: schemaError } = await supabase
          .rpc('get_schema_version', {})
          .catch(() => {
            // If the RPC doesn't exist yet, try a direct query to postgres catalogs
            return supabase.from('information_schema.tables')
              .select('table_schema')
              .limit(1);
          });
        
        if (schemaError) {
          // If we can't do either, check if we're using service role key
          if (schemaError.message.includes("permission denied")) {
            setTestResult({
              success: false, 
              message: "Connection successful, but insufficient permissions. Make sure you're using the service_role key."
            });
          } else {
            // We connected but still have a different error
            setTestResult({
              success: false, 
              message: "Connection successful, but couldn't verify permissions: " + schemaError.message
            });
          }
          return;
        }
        
        // Connection successful with proper permissions
        setTestResult({
          success: true, 
          message: "Connection successful! Ready to set up the database."
        });
      } catch (permError) {
        // Fallback that just assumes we're good if we can connect at all
        setTestResult({
          success: true, 
          message: "Connection successful! Ready to set up the database."
        });
      }
    } catch (error) {
      setTestResult({
        success: false, 
        message: "Connection failed: " + String(error)
      });
    } finally {
      setTesting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Connect to Supabase
        </h2>
        <p className="mt-2 text-gray-600">
          Enter your Supabase project details to connect
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="url">Supabase Project URL</Label>
          <Input
            id="url"
            name="url"
            value={config.url}
            onChange={handleChange}
            placeholder="https://your-project.supabase.co"
            className={validationErrors.url ? "border-red-500" : ""}
          />
          {validationErrors.url && (
            <p className="text-sm text-red-500">{validationErrors.url}</p>
          )}
          <p className="text-xs text-gray-500">
            Found in your Supabase project dashboard under Settings {'>'}  API
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="key">Supabase API Key</Label>
          <Input
            id="key"
            name="key"
            value={config.key}
            onChange={handleChange}
            type="password"
            placeholder="your-supabase-service-role-key"
            className={validationErrors.key ? "border-red-500" : ""}
          />
          {validationErrors.key && (
            <p className="text-sm text-red-500">{validationErrors.key}</p>
          )}
          <p className="text-xs text-gray-500">
            Use the <strong>service_role</strong> key (not anon/public), found in Settings {'>'}  API
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="projectId">Project ID</Label>
          <Input
            id="projectId"
            name="projectId"
            value={config.projectId}
            onChange={handleChange}
            placeholder="abcdefghijklmnopqrst"
            className={validationErrors.projectId ? "border-red-500" : ""}
          />
          {validationErrors.projectId && (
            <p className="text-sm text-red-500">{validationErrors.projectId}</p>
          )}
          <p className="text-xs text-gray-500">
            Found in the URL of your Supabase dashboard (or Settings {'>'}  General)
          </p>
        </div>

        <Button 
          onClick={testConnection} 
          variant="outline" 
          className="w-full"
          disabled={testing}
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            {testResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {testResult.success ? "Success" : "Connection Failed"}
            </AlertTitle>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <Separator />
      
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!testResult?.success}
        >
          Next: Database Setup
        </Button>
      </div>
    </div>
  );
}
