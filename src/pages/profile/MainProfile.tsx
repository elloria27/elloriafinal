import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

type Profile = Tables<"profiles">;

export default function MainProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
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
      <ProfileHeader 
        firstName={profile.first_name || ''}
        lastName={profile.last_name || ''}
        email={profile.email || null}
        phoneNumber={profile.phone || ''}
        address={profile.address || ''}
        country={profile.country || ''}
        region={profile.state || ''}
        language={profile.preferences?.language || 'en'}
        currency={profile.preferences?.currency || 'USD'}
      />
      <PersonalInfoForm 
        firstName={profile.first_name || ''}
        setFirstName={() => {}}
        lastName={profile.last_name || ''}
        setLastName={() => {}}
        email={profile.email || null}
        phoneNumber={profile.phone || ''}
        setPhoneNumber={() => {}}
        address={profile.address || ''}
        setAddress={() => {}}
        loading={loading}
      />
    </div>
  );
}