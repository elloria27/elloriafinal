
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';

interface SupabaseConnectionStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SupabaseConnectionStep = ({ onNext, onBack }: SupabaseConnectionStepProps) => {
  const [projectId, setProjectId] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const updateConfig = async () => {
    try {
      const clientContent = `// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "${supabaseUrl}";
export const SUPABASE_PUBLISHABLE_KEY = "${supabaseKey}";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
`;
      
      const configContent = `project_id = "${projectId}"`;
      
      const clientResponse = await window.fetch('/api/lovable/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: [
            {
              path: 'integrations/supabase/client.ts',
              content: clientContent
            },
            {
              path: 'supabase/config.toml',
              content: configContent
            }
          ]
        }),
      });

      if (!clientResponse.ok) {
        throw new Error('Failed to update configuration files');
      }

      return true;
    } catch (error) {
      console.error('Failed to update config files:', error);
      return false;
    }
  };

  const verifyConnection = async (supabase: any) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Connection verification failed:', error);
      throw new Error('Could not connect to Supabase. Please check your credentials.');
    }
  };

  const setupDatabase = async (supabase: any) => {
    try {
      const response = await fetch('/initial-setup.sql');
      const sqlContent = await response.text();
      
      // Split the SQL content into individual commands
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);

      // Execute each command separately
      for (const command of commands) {
        try {
          const { error } = await supabase.sql(command + ';');
          if (error) {
            console.error('SQL command failed:', command);
            throw error;
          }
        } catch (error) {
          // Log the error but continue with other commands
          console.error('Error executing SQL command:', error);
          // Only throw if it's a critical error
          if (error.message.includes('permission denied')) {
            throw error;
          }
        }
      }

      return true;
    } catch (error: any) {
      console.error('Database setup failed:', error);
      throw new Error(`Failed to set up database schema: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      if (!projectId || !supabaseUrl || !supabaseKey) {
        toast.error("Please fill in all fields");
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Step 1: Verify basic connectivity
      await verifyConnection(supabase);
      console.log("Connection verified successfully");

      // Step 2: Update configuration files
      const configUpdated = await updateConfig();
      if (!configUpdated) {
        throw new Error("Failed to update configuration files");
      }
      console.log("Configuration updated successfully");
      
      // Step 3: Setup database schema
      await setupDatabase(supabase);
      console.log("Database setup completed successfully");
      
      toast.success("Database setup completed successfully!");
      onNext();
    } catch (error: any) {
      console.error('Setup failed:', error);
      toast.error(error.message || "Failed to complete setup");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Connect to Supabase</DialogTitle>
        <DialogDescription>
          Enter your Supabase project details to connect the application.
          Make sure to use a fresh Supabase project without any existing tables.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectId">Project ID</Label>
          <Input
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter your Supabase project ID"
            className="rounded-full h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">Supabase URL</Label>
          <Input
            id="supabaseUrl"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
            className="rounded-full h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
          <Input
            id="supabaseKey"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="Enter your Supabase anon key"
            className="rounded-full h-12"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isConnecting}>
          {isConnecting ? "Setting up project..." : "Next"}
        </Button>
      </div>
    </form>
  );
};
