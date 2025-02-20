
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import fs from 'fs';
import path from 'path';
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

  const setupDatabase = async (supabase: any) => {
    try {
      // Read the SQL file content
      const sqlPath = path.join(process.cwd(), 'src', 'install', 'migrations', 'initial-setup.sql');
      const sqlContent = await fs.promises.readFile(sqlPath, 'utf8');
      
      // Split the SQL into individual statements
      const statements = sqlContent
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);

      // Execute each statement
      for (const statement of statements) {
        const { error } = await supabase.rpc('create_types', { sql: statement });
        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error setting up database:', error);
      return false;
    }
  };

  const testConnection = async (url: string, key: string) => {
    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase.from('user_roles').select('count');
      
      // If we can query user_roles, the database is already set up
      if (!error && data) {
        throw new Error('This Supabase project already has tables set up. Please use a fresh project.');
      }
      
      return supabase;
    } catch (error: any) {
      // If error is about relations not existing, that's good - means we have a fresh DB
      if (error?.message?.includes('relation "user_roles" does not exist')) {
        return createClient(url, key);
      }
      throw error;
    }
  };

  const updateConfig = async () => {
    try {
      const configPath = path.join(process.cwd(), 'supabase', 'config.toml');
      const clientPath = path.join(process.cwd(), 'src', 'integrations', 'supabase', 'client.ts');

      // Update config.toml
      await fs.promises.writeFile(
        configPath,
        `project_id = "${projectId}"\n`
      );

      // Update client.ts
      const clientContent = `
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "${supabaseUrl}";
const SUPABASE_PUBLISHABLE_KEY = "${supabaseKey}";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      `.trim();

      await fs.promises.writeFile(clientPath, clientContent);

      return true;
    } catch (error) {
      console.error('Failed to update config files:', error);
      return false;
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

      // First test the connection and ensure it's a fresh project
      const supabase = await testConnection(supabaseUrl, supabaseKey);
      
      // Set up the database with our schema
      const dbSetup = await setupDatabase(supabase);
      if (!dbSetup) {
        throw new Error("Failed to set up database schema");
      }

      // Update configuration files
      const configUpdated = await updateConfig();
      if (!configUpdated) {
        throw new Error("Failed to update configuration files");
      }

      toast.success("Supabase project configured successfully");
      onNext();
    } catch (error: any) {
      toast.error(error.message || "Failed to configure Supabase connection");
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">Supabase URL</Label>
          <Input
            id="supabaseUrl"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
          <Input
            id="supabaseKey"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="Enter your Supabase anon key"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isConnecting}>
          {isConnecting ? "Setting up database..." : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
};
