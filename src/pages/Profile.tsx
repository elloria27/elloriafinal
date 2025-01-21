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

type Profile = Tables<"profiles">;

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Main profile content component
  const MainProfile = () => {
    if (loading) {
      return <div className="p-8">Loading...</div>;
    }

    if (!profile) {
      return <div className="p-8">No profile found.</div>;
    }

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Profile Settings</h1>
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium mb-2">First Name</h2>
              <p className="text-gray-700 p-2 bg-gray-50 rounded-md">{profile.full_name?.split(' ')[0] || 'Not set'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2">Last Name</h2>
              <p className="text-gray-700 p-2 bg-gray-50 rounded-md">{profile.full_name?.split(' ')[1] || 'Not set'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2">Phone</h2>
              <p className="text-gray-700 p-2 bg-gray-50 rounded-md">{profile.phone_number || 'Not set'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2">Address</h2>
              <p className="text-gray-700 p-2 bg-gray-50 rounded-md">{profile.address || 'Not set'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2">Country</h2>
              <p className="text-gray-700 p-2 bg-gray-50 rounded-md">{profile.country || 'Not set'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2">Region</h2>
              <p className="text-gray-700 p-2 bg-gray-50 rounded-md">{profile.region || 'Not set'}</p>
            </div>
          </div>
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