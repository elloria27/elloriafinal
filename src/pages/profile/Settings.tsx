import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database, Tables } from "@/integrations/supabase/types";
import { PreferencesForm } from "@/components/profile/PreferencesForm";
import { LocationForm } from "@/components/profile/LocationForm";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { toast } from "sonner";

type Profile = Tables<"profiles">;

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please log in to view your profile settings");
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile settings");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <PreferencesForm profile={profile} />
      <LocationForm profile={profile} />
      <ProfileActions profile={profile} />
    </div>
  );
}
