
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import fs from 'fs';
import path from 'path';

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

      const success = await updateConfig();
      if (success) {
        toast.success("Supabase connection configured successfully");
        onNext();
      } else {
        toast.error("Failed to update configuration files");
      }
    } catch (error) {
      toast.error("Failed to configure Supabase connection");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Connect to Supabase</DialogTitle>
        <DialogDescription>
          Enter your Supabase project details to connect the application
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
          {isConnecting ? "Connecting..." : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
};
