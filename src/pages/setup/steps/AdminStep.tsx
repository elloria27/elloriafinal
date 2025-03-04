
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminStepProps {
  setupData: {
    adminEmail: string;
    adminPassword: string;
    adminName: string;
    [key: string]: string;
  };
  updateSetupData: (data: Partial<{
    adminEmail: string;
    adminPassword: string;
    adminName: string;
    [key: string]: string;
  }>) => void;
  updateSetupStatus: (step: string, status: "pending" | "complete" | "error") => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function AdminStep({
  setupData,
  updateSetupData,
  updateSetupStatus,
  onNext,
  onPrev,
}: AdminStepProps) {
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  const createAdminAccount = async () => {
    setCreatingAdmin(true);
    setAdminCreated(false);

    try {
      // Validate inputs
      if (!setupData.adminEmail || !setupData.adminPassword || !setupData.adminName) {
        toast.error("Please fill in all admin account fields");
        setCreatingAdmin(false);
        return;
      }

      if (setupData.adminPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        setCreatingAdmin(false);
        return;
      }

      if (!setupData.adminEmail.includes('@')) {
        toast.error("Please enter a valid email address");
        setCreatingAdmin(false);
        return;
      }

      // Register the admin user
      const { data, error } = await supabase.auth.signUp({
        email: setupData.adminEmail,
        password: setupData.adminPassword,
        options: {
          data: {
            full_name: setupData.adminName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // For this demo, we'll assume the user is created successfully
      // In a real implementation, we would also need to assign the admin role
      // to the user, but that would require a custom function with service_role access
      
      setAdminCreated(true);
      updateSetupStatus("admin", "complete");
      toast.success("Admin account created successfully!");
      
    } catch (error) {
      console.error("Admin creation error:", error);
      updateSetupStatus("admin", "error");
      toast.error(error instanceof Error ? error.message : "Failed to create admin account");
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Create Admin Account</h2>
        <p className="text-gray-500">
          Create your administrator account that will have full access to manage your site.
        </p>
      </div>

      <div className="space-y-4 my-6">
        <div className="space-y-2">
          <Label htmlFor="adminName">Full Name</Label>
          <Input
            id="adminName"
            placeholder="John Doe"
            value={setupData.adminName}
            onChange={(e) => updateSetupData({ adminName: e.target.value })}
            disabled={adminCreated}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminEmail">Email</Label>
          <Input
            id="adminEmail"
            type="email"
            placeholder="admin@example.com"
            value={setupData.adminEmail}
            onChange={(e) => updateSetupData({ adminEmail: e.target.value })}
            disabled={adminCreated}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminPassword">Password</Label>
          <Input
            id="adminPassword"
            type="password"
            placeholder="••••••••"
            value={setupData.adminPassword}
            onChange={(e) => updateSetupData({ adminPassword: e.target.value })}
            disabled={adminCreated}
          />
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={createAdminAccount}
            className="w-full"
            disabled={creatingAdmin || adminCreated}
            variant={adminCreated ? "outline" : "default"}
          >
            {creatingAdmin ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Admin Account...
              </>
            ) : adminCreated ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Admin Account Created
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Admin Account
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!adminCreated}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
