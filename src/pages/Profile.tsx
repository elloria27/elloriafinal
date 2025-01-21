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
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type Profile = Tables<"profiles">;

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please log in to view your profile");
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        if (data.country) setCountry(data.country);
        if (data.region) setRegion(data.region);
        if (data.phone_number) setPhoneNumber(data.phone_number);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleFormChange = async (field: string, value: string) => {
    console.log('Form change:', field, value);
    setHasChanges(true);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const updates = {
        ...formData,
        country,
        region,
        phone_number: phoneNumber,
        updated_at: new Date().toISOString(),
      };

      console.log('Saving updates:', updates);

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      setHasChanges(false);
      setFormData({});
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
      <div className="p-8 max-w-4xl mx-auto">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CustomerForm
            country={country}
            setCountry={setCountry}
            region={region}
            setRegion={setRegion}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            profile={profile}
            onFormChange={handleFormChange}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-20">
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