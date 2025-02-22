
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';
import initialSetup from '@/install/migrations/initial-setup.json';

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

const SUPABASE_URL = "${supabaseUrl}";
const SUPABASE_PUBLISHABLE_KEY = "${supabaseKey}";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
`;
      
      const configContent = `project_id = "${projectId}"`;
      
      // Save the configuration files
      const response = await window.fetch('/lovable/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: [
            {
              path: 'src/integrations/supabase/client.ts',
              content: clientContent
            },
            {
              path: 'supabase/config.toml',
              content: configContent
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration files');
      }

      return true;
    } catch (error) {
      console.error('Failed to update config files:', error);
      return false;
    }
  };

  const setupDatabase = async (supabase: any) => {
    try {
      console.log('Setting up database with combined SQL...');
      
      // Combine all type creation commands into a single SQL statement
      const typesSQL = initialSetup.types.join(';\n');
      const { error: typesError } = await supabase.rpc('create_table', { 
        sql: typesSQL 
      });
      
      if (typesError) {
        console.error('Types creation failed:', typesError);
        // Continue even if types exist
        if (!typesError.message.includes('already exists')) {
          throw typesError;
        }
      }

      // Create tables
      for (const tableCommand of initialSetup.tables) {
        const { error: tableError } = await supabase.rpc('create_table', { 
          sql: tableCommand 
        });
        
        if (tableError) {
          console.error('Table creation failed:', tableCommand, tableError);
          if (!tableError.message.includes('already exists')) {
            throw tableError;
          }
        }
      }

      // Create triggers
      for (const triggerCommand of initialSetup.triggers) {
        const { error: triggerError } = await supabase.rpc('create_table', { 
          sql: triggerCommand 
        });
        
        if (triggerError) {
          console.error('Trigger creation failed:', triggerCommand, triggerError);
          if (!triggerError.message.includes('already exists')) {
            throw triggerError;
          }
        }
      }

      return true;
    } catch (error: any) {
      console.error('Database setup failed:', error);
      throw new Error(`Failed to set up database schema: ${error.message}`);
    }
  };

  const validateInputs = () => {
    if (!projectId.trim()) throw new Error("Project ID is required");
    if (!supabaseUrl.trim()) throw new Error("Supabase URL is required");
    if (!supabaseKey.trim()) throw new Error("Supabase Key is required");
    
    // Validate URL format
    try {
      new URL(supabaseUrl);
    } catch {
      throw new Error("Invalid Supabase URL format");
    }

    // Validate project ID format
    if (!/^[a-zA-Z0-9-_]+$/.test(projectId)) {
      throw new Error("Invalid Project ID format");
    }

    // Validate key format (basic check)
    if (!supabaseKey.includes('.')) {
      throw new Error("Invalid Supabase Key format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      // Validate inputs first
      validateInputs();

      // Test the connection
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error("Could not connect to Supabase. Please check your credentials.");
      }

      // Update configuration files
      const configUpdated = await updateConfig();
      if (!configUpdated) {
        throw new Error("Failed to update configuration files");
      }

      // Initialize the database
      await setupDatabase(supabase);

      toast.success("Successfully connected to Supabase!");
      onNext();
    } catch (error: any) {
      console.error('Setup failed:', error);
      toast.error(error.message || "Failed to connect to Supabase");
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
