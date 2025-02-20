
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
  adminDetails: {
    email: string;
    password: string;
    fullName: string;
  };
}

export const SupabaseConnectionStep = ({ onNext, onBack, adminDetails }: SupabaseConnectionStepProps) => {
  const [projectId, setProjectId] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const updateConfig = async () => {
    try {
      // Update the Supabase client configuration
      const content = `// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "${supabaseUrl}";
export const SUPABASE_PUBLISHABLE_KEY = "${supabaseKey}";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
`;
      
      // Update both config files
      const [clientResponse, configResponse] = await Promise.all([
        fetch('/api/lovable/update-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: 'src/integrations/supabase/client.ts',
            content
          }),
        }),
        fetch('/api/lovable/update-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: 'supabase/config.toml',
            content: `project_id = "${projectId}"`
          }),
        })
      ]);

      if (!clientResponse.ok || !configResponse.ok) {
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
      // Simply check if we can connect to Supabase using the auth API
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Connection verification failed:', error);
      throw new Error('Could not connect to Supabase. Please check your credentials.');
    }
  };

  const createAdminUser = async (supabase: any) => {
    try {
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminDetails.email,
        password: adminDetails.password,
        options: {
          data: {
            full_name: adminDetails.fullName
          }
        }
      });

      if (authError) throw authError;

      // Wait briefly for triggers to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the user was created with admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .single();

      if (roleError) throw roleError;
      if (!roleData || roleData.role !== 'admin') {
        throw new Error('Failed to set up admin role');
      }

      return true;
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      throw new Error(error.message || 'Failed to create admin user');
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

      // Step 2: Update configuration files
      const configUpdated = await updateConfig();
      if (!configUpdated) {
        throw new Error("Failed to update configuration files");
      }
      
      // Step 3: Create the admin user
      await createAdminUser(supabase);

      toast.success("Installation completed successfully!");
      onNext();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete installation");
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
          {isConnecting ? "Setting up project..." : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
};
