import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { PreferencesForm } from "@/components/profile/PreferencesForm";
import { LocationForm } from "@/components/profile/LocationForm";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { toast } from "sonner";

type Profile = Tables<"profiles">;

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        setLanguage(data.language || 'en');
        setCurrency(data.currency || 'USD');
        setCountry(data.country || '');
        setRegion(data.region || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile settings");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          language,
          currency,
          country,
          region,
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success("Settings saved successfully");
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div className="p-8">
      <PreferencesForm
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
      />
      <LocationForm
        country={country}
        setCountry={setCountry}
        region={region}
        setRegion={setRegion}
      />
      <ProfileActions
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </div>
  );
}