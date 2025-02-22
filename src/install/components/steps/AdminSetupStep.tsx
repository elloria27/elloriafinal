
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';

interface AdminSetupStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const AdminSetupStep = ({ onComplete, onBack }: AdminSetupStepProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.VITE_SUPABASE_ANON_KEY || ''
      );

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Set user role as admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([
            { user_id: signUpData.user.id, role: 'admin' }
          ]);

        if (roleError) throw roleError;
      }

      toast.success("Admin account created successfully!");
      onComplete();
    } catch (error: any) {
      console.error('Admin setup failed:', error);
      toast.error(error.message || "Failed to create admin account");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Create Admin Account</DialogTitle>
        <DialogDescription>
          Set up your administrator account to manage the system.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="rounded-full h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="rounded-full h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a strong password"
            required
            minLength={8}
            className="rounded-full h-12"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating account..." : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
};
