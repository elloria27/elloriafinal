
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@supabase/supabase-js";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface UserSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  onUserUpdate: (user: { email: string; password: string; fullName: string }) => void;
  user: { email: string; password: string; fullName: string };
  supabaseConfig: { url: string; key: string };
  updateStatus: (status: { userCreated: boolean }) => void;
}

const UserSetupStep = ({ 
  onNext, 
  onBack, 
  onUserUpdate, 
  user,
  supabaseConfig,
  updateStatus
}: UserSetupStepProps) => {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [fullName, setFullName] = useState(user.fullName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = () => {
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!fullName) return "Full name is required";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create a temporary Supabase client with the provided credentials
      const tempSupabase = createClient(supabaseConfig.url, supabaseConfig.key);
      
      // Create the admin user
      const { data: userData, error: userError } = await tempSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
      });
      
      if (userError) throw new Error(`User creation failed: ${userError.message}`);
      if (!userData?.user) throw new Error("No user data returned");

      // Set user role to admin
      const { error: roleError } = await tempSupabase
        .from('user_roles')
        .insert([
          { user_id: userData.user.id, role: 'admin' }
        ]);
      
      if (roleError) throw new Error(`Role assignment failed: ${roleError.message}`);

      // Update profile with full name
      const { error: profileError } = await tempSupabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', userData.user.id);
      
      if (profileError) throw new Error(`Profile update failed: ${profileError.message}`);
      
      setSuccess("Admin user created successfully!");
      onUserUpdate({ email, password, fullName });
      updateStatus({ userCreated: true });
      
      // Continue to next step
      setTimeout(() => {
        onNext();
      }, 2000);
    } catch (err) {
      console.error("Admin user creation error:", err);
      setError(err instanceof Error ? err.message : "Failed to create admin user");
      updateStatus({ userCreated: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">Create Admin User</h2>
      
      <p className="text-center text-lg text-gray-700 mb-8">
        Set up an administrator account to manage your system.
      </p>
      
      <div className="space-y-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
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
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" disabled={isLoading}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Admin User"}
        </Button>
      </div>
    </div>
  );
};

export default UserSetupStep;
