import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log("Checking admin access...");
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast.error("Session error");
        navigate("/admin/login");
        return;
      }

      if (!session) {
        console.log("No active session");
        toast.error("Please login to access admin panel");
        navigate("/admin/login");
        return;
      }

      console.log("Session found, checking admin role...");

      // Single request to check admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast.error("Error fetching user profile");
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      if (!profile || profile.role !== 'admin') {
        console.error("User is not an admin:", profile);
        toast.error("Unauthorized access - Admin privileges required");
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      console.log("Admin access confirmed");
    };

    checkAdminAccess();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};