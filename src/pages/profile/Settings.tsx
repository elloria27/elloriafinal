import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    email_notifications: false,
    marketing_emails: false,
    language: "en",
    currency: "USD",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("Checking auth session...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("No authenticated user found");
        toast.error("Please sign in to view settings");
        return;
      }

      console.log("Fetching profile for user:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile settings");
        return;
      }

      if (data) {
        console.log("Profile loaded:", data);
        setProfile(data);
        setFormData({
          email_notifications: data.email_notifications || false,
          marketing_emails: data.marketing_emails || false,
          language: data.language || "en",
          currency: data.currency || "USD",
        });
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to update settings");
        return;
      }

      console.log("Updating settings for user:", user.id);
      const { error } = await supabase
        .from("profiles")
        .update({
          email_notifications: formData.email_notifications,
          marketing_emails: formData.marketing_emails,
          language: formData.language,
          currency: formData.currency,
        })
        .eq("id", user.id);

      if (error) throw error;

      console.log("Settings updated successfully");
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please sign in to view settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about your account
                </p>
              </div>
              <Switch
                checked={formData.email_notifications}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, email_notifications: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new products and features
                </p>
              </div>
              <Switch
                checked={formData.marketing_emails}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, marketing_emails: checked }))
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.language}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, language: e.target.value }))
                }
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="uk">Ukrainian</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Currency</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.currency}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, currency: e.target.value }))
                }
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="UAH">UAH (₴)</option>
              </select>
            </div>
          </div>
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