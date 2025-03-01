
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@supabase/supabase-js";
import { runMigrations } from "@/utils/migration";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface DatabaseConnectionStepProps {
  onNext: () => void;
  onBack: () => void;
  onConfigUpdate: (config: { url: string; key: string }) => void;
  config: { url: string; key: string };
  updateStatus: (status: { connected: boolean; migrated: boolean }) => void;
}

const DatabaseConnectionStep = ({ 
  onNext, 
  onBack, 
  onConfigUpdate, 
  config,
  updateStatus
}: DatabaseConnectionStepProps) => {
  const [url, setUrl] = useState(config.url);
  const [key, setKey] = useState(config.key);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMigrated, setIsMigrated] = useState(false);

  const testConnection = async () => {
    if (!url || !key) {
      setError("Please provide both Supabase URL and API Key");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create a temporary Supabase client with the provided credentials
      const tempSupabase = createClient(url, key);
      
      // Test the connection by making a simple query
      const { error } = await tempSupabase.from('profiles').select('count', { count: 'exact', head: true });
      
      if (error) {
        throw new Error(`Connection failed: ${error.message}`);
      }
      
      setSuccess("Successfully connected to Supabase!");
      setIsConnected(true);
      updateStatus({ connected: true, migrated: false });
      onConfigUpdate({ url, key });
    } catch (err) {
      console.error("Connection error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to Supabase");
      setIsConnected(false);
      updateStatus({ connected: false, migrated: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigration = async () => {
    if (!isConnected) {
      setError("Please test and establish connection first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create a temporary Supabase client with the provided credentials
      const tempSupabase = createClient(url, key);
      
      // Run database migrations
      await runMigrations(tempSupabase);
      
      setSuccess("Database migrations completed successfully!");
      setIsMigrated(true);
      updateStatus({ migrated: true });
      
      // Continue to next step
      setTimeout(() => {
        onNext();
      }, 2000);
    } catch (err) {
      console.error("Migration error:", err);
      setError(err instanceof Error ? err.message : "Failed to run database migrations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">Database Connection</h2>
      
      <p className="text-center text-lg text-gray-700 mb-8">
        Connect your Supabase project to complete the installation.
      </p>
      
      <div className="space-y-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input
            id="supabase-url"
            placeholder="https://your-project-id.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading || isConnected}
          />
          <p className="text-xs text-gray-500">
            Your Supabase project URL from the API settings in your dashboard
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supabase-key">Supabase Service Role Key</Label>
          <Input
            id="supabase-key"
            type="password"
            placeholder="Supabase service_role key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={isLoading || isConnected}
          />
          <p className="text-xs text-gray-500">
            Your service_role key (not anon/public) from the API settings
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              Connection Status:
              {isConnected ? (
                <span className="ml-2 text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Connected
                </span>
              ) : (
                <span className="ml-2 text-gray-500">Not connected</span>
              )}
            </h4>
            <Button 
              onClick={testConnection} 
              variant="outline" 
              disabled={isLoading || !url || !key || isConnected}
              className="w-full"
            >
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              Migration Status:
              {isMigrated ? (
                <span className="ml-2 text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
                </span>
              ) : (
                <span className="ml-2 text-gray-500">Not started</span>
              )}
            </h4>
            <Button 
              onClick={handleMigration} 
              disabled={isLoading || !isConnected || isMigrated}
              className="w-full"
            >
              {isLoading ? "Migrating..." : "Run Migrations"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" disabled={isLoading}>
          Back
        </Button>
        <Button onClick={onNext} disabled={isLoading || !isConnected || !isMigrated}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DatabaseConnectionStep;
