import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PreferencesForm } from "./PreferencesForm";

export function AccountPreferences() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      console.log("Loading preferences for user:", user.id);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("language, currency")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading preferences:", error);
        toast.error("Failed to load preferences");
        return;
      }

      if (profile) {
        console.log("Loaded preferences:", profile);
        setLanguage(profile.language || "en");
        setCurrency(profile.currency || "USD");
      }
    } catch (error) {
      console.error("Error in loadPreferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      console.log("Saving preferences for user:", user.id);
      const { error } = await supabase
        .from("profiles")
        .update({
          language,
          currency,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error saving preferences:", error);
        toast.error("Failed to save preferences");
        return;
      }

      console.log("Preferences saved successfully");
      toast.success("Preferences updated");
    } catch (error) {
      console.error("Error in savePreferences:", error);
      toast.error("Failed to save preferences");
    }
  };

  if (loading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage your language and currency preferences
        </p>
      </div>
      
      <PreferencesForm
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
      />

      <button
        onClick={savePreferences}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
      >
        Save Preferences
      </button>
    </div>
  );
}