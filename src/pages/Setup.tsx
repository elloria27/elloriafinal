
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { initializeSupabase } from "@/integrations/supabase/client";

type SetupStep = "welcome" | "benefits" | "supabase" | "admin";

export default function Setup() {
  const [currentStep, setCurrentStep] = useState<SetupStep>("welcome");
  const [supabaseConfig, setSupabaseConfig] = useState({
    project_id: "",
    supabase_url: "",
    supabase_key: ""
  });
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    full_name: ""
  });
  const navigate = useNavigate();

  const handleSupabaseConfig = async () => {
    try {
      // Initialize Supabase client with the new configuration
      const client = initializeSupabase(
        supabaseConfig.supabase_url,
        supabaseConfig.supabase_key
      );

      // Test the connection by making a simple query
      const { error } = await client
        .from('site_settings')
        .select('id')
        .limit(1);

      if (error) {
        throw new Error('Failed to connect to Supabase');
      }

      // Store the configuration in localStorage
      localStorage.setItem('supabase_url', supabaseConfig.supabase_url);
      localStorage.setItem('supabase_key', supabaseConfig.supabase_key);

      toast.success("Supabase configuration saved successfully");
      setCurrentStep("admin");
    } catch (error) {
      toast.error("Failed to configure Supabase. Please check your credentials.");
      console.error(error);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const client = initializeSupabase(
        localStorage.getItem('supabase_url') || '',
        localStorage.getItem('supabase_key') || ''
      );

      const { error: signUpError } = await client.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          data: {
            full_name: adminData.full_name,
          }
        }
      });

      if (signUpError) throw signUpError;

      toast.success("Setup completed successfully!");
      navigate('/');
    } catch (error) {
      toast.error("Failed to create admin user");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
        {currentStep === "welcome" && (
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold">Welcome to the Setup Wizard</h1>
            <p className="text-gray-600">Let's get your application up and running.</p>
            <Button onClick={() => setCurrentStep("benefits")}>Next</Button>
          </div>
        )}

        {currentStep === "benefits" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">System Benefits</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Complete e-commerce solution</li>
              <li>Advanced user management</li>
              <li>Blog and content management</li>
              <li>Inventory tracking</li>
              <li>Comprehensive analytics</li>
            </ul>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentStep("welcome")}>Back</Button>
              <Button onClick={() => setCurrentStep("supabase")}>Next</Button>
            </div>
          </div>
        )}

        {currentStep === "supabase" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Supabase Configuration</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project_id">Project ID</Label>
                <Input
                  id="project_id"
                  value={supabaseConfig.project_id}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, project_id: e.target.value }))}
                  placeholder="Enter your Supabase project ID"
                />
              </div>
              <div>
                <Label htmlFor="supabase_url">Supabase URL</Label>
                <Input
                  id="supabase_url"
                  value={supabaseConfig.supabase_url}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, supabase_url: e.target.value }))}
                  placeholder="Enter your Supabase URL"
                />
              </div>
              <div>
                <Label htmlFor="supabase_key">Supabase Anon Key</Label>
                <Input
                  id="supabase_key"
                  value={supabaseConfig.supabase_key}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, supabase_key: e.target.value }))}
                  placeholder="Enter your Supabase anon key"
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentStep("benefits")}>Back</Button>
              <Button onClick={handleSupabaseConfig}>Next</Button>
            </div>
          </div>
        )}

        {currentStep === "admin" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Create Admin Account</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter admin email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminData.password}
                  onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter admin password"
                />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={adminData.full_name}
                  onChange={(e) => setAdminData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentStep("supabase")}>Back</Button>
              <Button onClick={handleCreateAdmin}>Complete Setup</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
