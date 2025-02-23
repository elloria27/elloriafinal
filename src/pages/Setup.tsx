
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Setup() {
  const [config, setConfig] = useState({
    projectId: "",
    supabaseUrl: "",
    supabaseKey: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/setup/configure-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      toast.success("Configuration saved successfully!");
      navigate('/');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error("Failed to save configuration");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-center">Supabase Configuration</h2>
          <p className="mt-2 text-center text-gray-600">
            Enter your Supabase project details below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                value={config.projectId}
                onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
                placeholder="Enter your Supabase project ID"
                required
              />
            </div>

            <div>
              <Label htmlFor="supabaseUrl">Supabase URL</Label>
              <Input
                id="supabaseUrl"
                value={config.supabaseUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                placeholder="Enter your Supabase URL"
                required
              />
            </div>

            <div>
              <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
              <Input
                id="supabaseKey"
                value={config.supabaseKey}
                onChange={(e) => setConfig(prev => ({ ...prev, supabaseKey: e.target.value }))}
                placeholder="Enter your Supabase anon key"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Configuration
          </Button>
        </form>
      </div>
    </div>
  );
}
