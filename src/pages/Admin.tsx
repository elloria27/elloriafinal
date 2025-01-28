import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { PageManagement } from "@/components/admin/PageManagement";
import { FileManagement } from "@/components/admin/FileManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";
import Dashboard from "@/pages/admin/Dashboard";
import SiteSettings from "@/pages/admin/SiteSettings";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log('No active session, redirecting to login');
          navigate("/login?redirectTo=/admin");
          return;
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          console.log('Profile data:', profileData);
          setProfile(profileData);
        }

        const { data: roleData, error: roleError } = await supabase
          .rpc('is_admin', {
            user_id: session.user.id
          });

        if (roleError) {
          console.error('Error checking admin role:', roleError);
          throw roleError;
        }

        if (!roleData) {
          console.log('User is not an admin, access denied');
          toast.error("Unauthorized access - Admin privileges required");
          navigate("/");
          return;
        }

        setIsAdmin(true);
        toast.success("Welcome to Admin Panel");

      } catch (error) {
        console.error('Admin access check failed:', error);
        toast.error("Error verifying admin access");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      case "pages":
        return <PageManagement />;
      case "blog":
        return <BlogManagement />;
      case "files":
        return <FileManagement />;
      case "settings":
        return <SiteSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {(sidebarOpen || !isMobile) && (
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 lg:relative",
            isMobile ? "w-full lg:w-64" : "w-64"
          )}>
            <AdminSidebar />
          </div>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;