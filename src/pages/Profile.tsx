import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Activity from "./profile/Activity";
import Invoices from "./profile/Invoices";
import Settings from "./profile/Settings";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { LocationForm } from "@/components/profile/LocationForm";

type Profile = Tables<"profiles">;

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        toast.error("Failed to load user data");
        return;
      }

      if (!user) {
        toast.error("Please log in to view your profile");
        return;
      }

      console.log('Fetching profile for user:', user.id);
      setUserEmail(user.email);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile data");
        return;
      }
      
      if (data) {
        console.log('Profile data loaded:', data);
        setProfile(data);
        if (data.full_name) {
          const [first, ...rest] = data.full_name.split(' ');
          setFirstName(first || '');
          setLastName(rest.join(' ') || '');
        }
        setPhoneNumber(data.phone_number || '');
        setAddress(data.address || '');
        setCountry(data.country || '');
        setRegion(data.region || '');
      } else {
        console.log('No profile found for user');
        toast.error("Profile not found");
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!profile?.id) {
      toast.error("No profile ID found");
      return;
    }
    
    setIsSaving(true);
    try {
      const updates = {
        full_name: `${firstName} ${lastName}`.trim(),
        phone_number: phoneNumber,
        address,
        country,
        region,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating profile with:', updates);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      setHasChanges(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Main profile content component
  const MainProfile = () => {
    if (loading) {
      return <div className="p-8">Loading...</div>;
    }

    if (!profile) {
      return <div className="p-8">No profile found.</div>;
    }

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Profile Settings</h1>
          {hasChanges && (
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          <PersonalInfoForm
            firstName={firstName}
            setFirstName={(value) => {
              setFirstName(value);
              setHasChanges(true);
            }}
            lastName={lastName}
            setLastName={(value) => {
              setLastName(value);
              setHasChanges(true);
            }}
            email={userEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={(value) => {
              setPhoneNumber(value);
              setHasChanges(true);
            }}
            address={address}
            setAddress={(value) => {
              setAddress(value);
              setHasChanges(true);
            }}
            loading={loading}
          />

          <LocationForm
            country={country}
            setCountry={(value) => {
              setCountry(value);
              setRegion("");
              setHasChanges(true);
            }}
            region={region}
            setRegion={(value) => {
              setRegion(value);
              setHasChanges(true);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-32">
        <SidebarProvider defaultOpen>
          <div className="flex w-full bg-gray-50">
            <AccountSidebar />
            <main className="flex-1">
              <Routes>
                <Route index element={<MainProfile />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="activity" element={<Activity />} />
                <Route path="settings" element={<Settings profile={profile} loading={loading} />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}