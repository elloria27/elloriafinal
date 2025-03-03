
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@supabase/supabase-js";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

interface AdminSetupStepProps {
  config: {
    url: string;
    key: string;
    projectId: string;
  };
  admin: {
    email: string;
    password: string;
    fullName: string;
  };
  setAdmin: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      fullName: string;
    }>
  >;
  onNext: () => void;
  onBack: () => void;
}

export function AdminSetupStep({
  config,
  admin,
  setAdmin,
  onNext,
  onBack,
}: AdminSetupStepProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = () => {
    const errors: Record<string, string> = {};
    
    if (!admin.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(admin.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!admin.password.trim()) {
      errors.password = "Password is required";
    } else if (admin.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    if (!admin.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const createAdminUser = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsCreating(true);
    setError(null);
    setSuccess(false);
    
    try {
      const supabase = createClient(config.url, config.key);
      
      // Create user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true, // Auto-confirm email
      });
      
      if (authError) {
        throw new Error(`Failed to create user: ${authError.message}`);
      }
      
      if (!authData.user) {
        throw new Error("User creation returned no user data");
      }
      
      // Create profile with admin role
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          full_name: admin.fullName,
          email: admin.email,
          role: "admin",
        });
      
      if (profileError) {
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
      
      // Initialize site settings
      const { error: settingsError } = await supabase
        .from("site_settings")
        .insert({
          site_name: "My CMS",
          site_description: "A powerful content management system",
          created_by: authData.user.id,
        });
      
      if (settingsError) {
        throw new Error(`Failed to create site settings: ${settingsError.message}`);
      }
      
      setSuccess(true);
      
      // Wait a moment then proceed to next step
      setTimeout(() => {
        onNext();
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Create Admin User
        </h2>
        <p className="mt-2 text-gray-600">
          Set up your admin account to manage the CMS
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={admin.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={validationErrors.fullName ? "border-red-500" : ""}
            disabled={isCreating || success}
          />
          {validationErrors.fullName && (
            <p className="text-sm text-red-500">{validationErrors.fullName}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={admin.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className={validationErrors.email ? "border-red-500" : ""}
            disabled={isCreating || success}
          />
          {validationErrors.email && (
            <p className="text-sm text-red-500">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={admin.password}
              onChange={handleChange}
              placeholder="Secure password"
              className={validationErrors.password ? "border-red-500 pr-10" : "pr-10"}
              disabled={isCreating || success}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isCreating || success}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-sm text-red-500">{validationErrors.password}</p>
          )}
          <p className="text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription className="text-green-600">
              Admin user created successfully!
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={createAdminUser} 
          className="w-full"
          disabled={isCreating || success}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Admin User...
            </>
          ) : success ? (
            "Admin Created Successfully!"
          ) : (
            "Create Admin User"
          )}
        </Button>
      </div>

      <Separator />
      
      <div className="flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline" 
          disabled={isCreating}
        >
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!success && !admin.email}
        >
          Next: Complete Setup
        </Button>
      </div>
    </div>
  );
}
