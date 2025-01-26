import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    console.log("Settings component mounted");
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log("Loading profile...");
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        console.log("No session found");
        toast.error("Please sign in to view settings");
        return;
      }

      console.log("Current user ID:", session.user.id);

      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleError) {
        console.error("Error checking user role:", roleError);
        toast.error("Error loading user role");
        return;
      }

      if (roleData.role !== 'admin') {
        console.log("User is not an admin");
        toast.error("Admin access required");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Failed to load profile");
        return;
      }

      if (!profileData) {
        console.log("Creating new admin profile");
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              email_notifications: false,
              marketing_emails: false,
              language: "en",
              currency: "USD"
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          toast.error("Failed to create profile");
          return;
        }

        console.log("New profile created:", newProfile);
        setProfile(newProfile);
      } else {
        console.log("Profile loaded:", profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error in loadProfile:", error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast.error("No profile data to save");
      return;
    }

    setSaving(true);
    console.log("Saving profile changes:", profile);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to update settings");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          email_notifications: profile.email_notifications,
          marketing_emails: profile.marketing_emails,
          language: profile.language,
          currency: profile.currency,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Settings updated successfully");
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
                checked={profile.email_notifications || false}
                onCheckedChange={(checked) =>
                  setProfile(prev => prev ? { ...prev, email_notifications: checked } : null)
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
                checked={profile.marketing_emails || false}
                onCheckedChange={(checked) =>
                  setProfile(prev => prev ? { ...prev, marketing_emails: checked } : null)
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
                value={profile.language || 'en'}
                onChange={(e) =>
                  setProfile(prev => prev ? { ...prev, language: e.target.value } : null)
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
                value={profile.currency || 'USD'}
                onChange={(e) =>
                  setProfile(prev => prev ? { ...prev, currency: e.target.value } : null)
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