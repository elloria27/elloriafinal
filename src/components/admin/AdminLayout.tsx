import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to access admin panel");
        navigate("/admin/login");
        return;
      }

      // Check if user has admin role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !profile || profile.role !== "admin") {
        toast.error("Unauthorized access");
        navigate("/");
        return;
      }
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