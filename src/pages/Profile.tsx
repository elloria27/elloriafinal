import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MainProfile from "./profile/MainProfile";
import Invoices from "./profile/Invoices";
import Activity from "./profile/Activity";
import Settings from "./profile/Settings";

const Profile = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No active session found");
          toast.error("Please sign in to view your profile");
          return <Navigate to="/login" />;
        }
        console.log("Active session found for user:", session.user.id);
        setLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Error loading profile");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 md:pt-24">
        <div className="container mx-auto px-4">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 md:gap-8">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <AccountSidebar onClose={() => {}} />
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden md:block w-72">
              <AccountSidebar />
            </div>
          )}
          <div className="flex-1">
            <Routes>
              <Route index element={<MainProfile />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="activity" element={<Activity />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;