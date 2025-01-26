import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsForm } from "./NotificationsForm";

export function NotificationSettings() {
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      console.log("Loading notification settings for user:", user.id);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("email_notifications, marketing_emails")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading notification settings:", error);
        toast.error("Failed to load notification settings");
        return;
      }

      if (profile) {
        console.log("Loaded notification settings:", profile);
        setEmailNotifications(profile.email_notifications || false);
        setMarketingEmails(profile.marketing_emails || false);
      }
    } catch (error) {
      console.error("Error in loadNotificationSettings:", error);
      toast.error("Failed to load notification settings");
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      console.log("Saving notification settings for user:", user.id);
      const { error } = await supabase
        .from("profiles")
        .update({
          email_notifications: emailNotifications,
          marketing_emails: marketingEmails,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error saving notification settings:", error);
        toast.error("Failed to save notification settings");
        return;
      }

      console.log("Notification settings saved successfully");
      toast.success("Notification settings updated");
    } catch (error) {
      console.error("Error in saveNotificationSettings:", error);
      toast.error("Failed to save notification settings");
    }
  };

  if (loading) {
    return <div>Loading notification settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your email and marketing preferences
        </p>
      </div>

      <NotificationsForm
        emailNotifications={emailNotifications}
        setEmailNotifications={setEmailNotifications}
        marketingEmails={marketingEmails}
        setMarketingEmails={setMarketingEmails}
      />

      <button
        onClick={saveNotificationSettings}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
      >
        Save Notification Settings
      </button>
    </div>
  );
}