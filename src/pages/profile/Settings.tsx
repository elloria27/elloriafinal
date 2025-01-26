import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PreferencesForm } from "@/components/profile/PreferencesForm";
import { NotificationsForm } from "@/components/profile/NotificationsForm";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Preferences state
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  
  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log("Loading admin settings...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("No active session");
        return;
      }

      // Load profile settings
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (profile) {
        console.log("Settings loaded:", profile);
        setLanguage(profile.language || "en");
        setCurrency(profile.currency || "USD");
        setEmailNotifications(profile.email_notifications || false);
        setMarketingEmails(profile.marketing_emails || false);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      console.log("Saving settings...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          language,
          currency,
          email_notifications: emailNotifications,
          marketing_emails: marketingEmails,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      console.log("Settings saved successfully");
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <PreferencesForm
            language={language}
            setLanguage={setLanguage}
            currency={currency}
            setCurrency={setCurrency}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <NotificationsForm
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            marketingEmails={marketingEmails}
            setMarketingEmails={setMarketingEmails}
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}