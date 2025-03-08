
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MainProfile from "./profile/MainProfile";
import Invoices from "./profile/Invoices";
import Activity from "./profile/Activity";
import Settings from "./profile/Settings";

const Profile = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log("No active session found");
          toast.error("Please sign in to view your profile");
          setLoading(false);
          return;
        }
        
        // Validate the token by fetching user data
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          console.log("Invalid token");
          localStorage.removeItem('authToken');
          toast.error("Session expired. Please sign in again.");
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log("Active session found for user:", data.user.id);
        setUser(data.user);
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
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirectTo=/profile" />;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="flex gap-4">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden fixed top-24 right-4 z-50">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <AccountSidebar onClose={() => {}} />
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden md:block w-72 shrink-0">
              <AccountSidebar />
            </div>
          )}
          <div className="flex-1 w-full">
            <Routes>
              <Route index element={<MainProfile user={user} />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="activity" element={<Activity />} />
              <Route path="settings" element={<Settings user={user} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
