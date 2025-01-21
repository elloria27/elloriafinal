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
import { MainProfileContent } from "@/components/profile/MainProfileContent";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-32">
        <SidebarProvider defaultOpen>
          <div className="flex w-full bg-gray-50">
            <AccountSidebar />
            <main className="flex-1">
              <Routes>
                <Route index element={
                  <MainProfileContent
                    profile={profile}
                    loading={loading}
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
                    userEmail={userEmail}
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
                    country={country}
                    setCountry={(value) => {
                      setCountry(value);
                      setHasChanges(true);
                    }}
                    region={region}
                    setRegion={(value) => {
                      setRegion(value);
                      setHasChanges(true);
                    }}
                    hasChanges={hasChanges}
                    isSaving={isSaving}
                    handleSave={handleSave}
                  />
                } />
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