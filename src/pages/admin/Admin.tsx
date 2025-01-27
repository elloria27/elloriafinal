import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { PageManagement } from "@/components/admin/PageManagement";
import { FileManagement } from "@/components/admin/FileManagement";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  ShoppingCart, 
  Settings,
  FolderIcon,
} from "lucide-react";
import Dashboard from "./Dashboard";
import SiteSettings from "./SiteSettings";
import { cn } from "@/lib/utils";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Checking session status:', session ? 'Session exists' : 'No session');
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log('No active session, redirecting to login');
          navigate("/login?redirectTo=/admin");
          return;
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
    { id: "pages", label: "Pages", icon: FileText },
    { id: "files", label: "Files", icon: FolderIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Tabs */}
      <div className="w-full max-w-[1400px] mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
            <div className="flex items-center gap-1 px-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                    activeTab === item.id
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "pages" && <PageManagement />}
          {activeTab === "files" && <FileManagement />}
          {activeTab === "settings" && <SiteSettings />}
        </div>
      </div>
    </div>
  );
};

export default Admin;