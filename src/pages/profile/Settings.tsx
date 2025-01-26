import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AccountPreferences } from "@/components/profile/AccountPreferences";
import { NotificationSettings } from "@/components/profile/NotificationSettings";

export default function Settings() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user found");
        toast.error("Please sign in to access settings");
        return;
      }
      console.log("Authenticated user:", user.id);
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Authentication error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="space-y-10">
        <AccountPreferences />
        <NotificationSettings />
      </div>
    </div>
  );
}