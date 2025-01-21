import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
      return <div className="p-6">Loading...</div>;
    }

    if (!profile) {
      return <div className="p-6">No profile found.</div>;
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="font-medium">Full Name</label>
            <p>{profile.full_name}</p>
          </div>
          <div>
            <label className="font-medium">Phone</label>
            <p>{profile.phone_number || 'Not set'}</p>
          </div>
          <div>
            <label className="font-medium">Address</label>
            <p>{profile.address || 'Not set'}</p>
          </div>
          <div>
            <label className="font-medium">Region</label>
            <p>{profile.region || 'Not set'}</p>
          </div>
          <div>
            <label className="font-medium">Country</label>
            <p>{profile.country || 'Not set'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50 pt-24">
          <AccountSidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<MainProfile />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </>
  );
}