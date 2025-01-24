import { useState, useEffect } from "react";
import { MainProfileContent } from "@/components/profile/MainProfileContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export default function MainProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log("No authenticated user found");
        return;
      }

      setUserEmail(session.user.email);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (profileData) {
        console.log("Profile data fetched:", profileData);
        setProfile(profileData);
        
        // Split full name into first and last name
        const nameParts = (profileData.full_name || "").split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        
        setPhoneNumber(profileData.phone_number || "");
        setAddress(profileData.address || "");
        setCountry(profileData.country || "");
        setRegion(profileData.region || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newFullName = `${firstName} ${lastName}`.trim();
    const currentFullName = profile?.full_name || "";
    
    const hasProfileChanges = 
      newFullName !== currentFullName ||
      phoneNumber !== (profile?.phone_number || "") ||
      address !== (profile?.address || "") ||
      country !== (profile?.country || "") ||
      region !== (profile?.region || "");

    setHasChanges(hasProfileChanges);
  }, [firstName, lastName, phoneNumber, address, country, region, profile]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const updates = {
        id: session.user.id,
        full_name: `${firstName} ${lastName}`.trim(),
        phone_number: phoneNumber,
        address: address,
        country: country,
        region: region,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setProfile(prev => ({ ...prev!, ...updates }));
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainProfileContent
      profile={profile}
      loading={loading}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      userEmail={userEmail}
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      address={address}
      setAddress={setAddress}
      country={country}
      setCountry={setCountry}
      region={region}
      setRegion={setRegion}
      hasChanges={hasChanges}
      isSaving={isSaving}
      handleSave={handleSave}
    />
  );
}