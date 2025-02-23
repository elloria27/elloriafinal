import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, Settings, Database, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const STEPS = {
  WELCOME: 0,
  BENEFITS: 1,
  SUPABASE: 2,
  ADMIN: 3
};

export default function Setup() {
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    projectId: "",
    supabaseUrl: "",
    supabaseKey: ""
  });
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  const handleSupabaseConfig = async () => {
    setLoading(true);
    try {
      // Initialize Supabase client first
      initializeSupabase(config.supabaseUrl, config.supabaseKey);

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

      // Run migrations
      const migrateResponse = await fetch('/api/setup/run-migrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseUrl: config.supabaseUrl,
          supabaseKey: config.supabaseKey
        }),
      });

      if (!migrateResponse.ok) {
        throw new Error('Failed to run migrations');
      }

      toast.success("Configuration saved successfully!");
      setCurrentStep(STEPS.ADMIN);
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error("Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin user');
      }

      toast.success("Setup completed successfully!");
      navigate('/');
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error("Failed to create admin user");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome to the Setup Wizard</h2>
            <p className="text-gray-600">
              Let's get your system up and running in just a few simple steps.
            </p>
            <Button onClick={() => setCurrentStep(STEPS.BENEFITS)}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case STEPS.BENEFITS:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">System Benefits</h2>
            <div className="grid gap-4">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Complete E-commerce Solution</h3>
                  <p className="text-gray-600">Manage products, orders, and inventory efficiently</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Content Management</h3>
                  <p className="text-gray-600">Blog, pages, and media management</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">HRM Features</h3>
                  <p className="text-gray-600">Task management, invoicing, and team collaboration</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setCurrentStep(STEPS.SUPABASE)} className="w-full">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case STEPS.SUPABASE:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center">Supabase Configuration</h2>
              <p className="mt-2 text-center text-gray-600">
                Enter your Supabase project details below
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  value={config.projectId}
                  onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
                  placeholder="Enter your Supabase project ID"
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button 
              onClick={handleSupabaseConfig} 
              disabled={loading || !config.projectId || !config.supabaseUrl || !config.supabaseKey}
              className="w-full"
            >
              {loading ? "Configuring..." : "Save Configuration"}
            </Button>
          </div>
        );

      case STEPS.ADMIN:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center">Create Admin Account</h2>
              <p className="mt-2 text-center text-gray-600">
                Set up your administrator account to manage the system
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter admin email"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminData.password}
                  onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={adminData.fullName}
                  onChange={(e) => setAdminData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button 
              onClick={handleCreateAdmin}
              disabled={loading || !adminData.email || !adminData.password || !adminData.fullName}
              className="w-full"
            >
              {loading ? "Creating Admin..." : "Complete Setup"}
            </Button>
          </div>
        );
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { icon: Settings, label: "Welcome" },
      { icon: Check, label: "Benefits" },
      { icon: Database, label: "Supabase" },
      { icon: User, label: "Admin" }
    ];

    return (
      <div className="flex justify-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-px mt-4 mx-2 ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
        {renderStepIndicator()}
        {renderStep()}
      </div>
    </div>
  );
}
