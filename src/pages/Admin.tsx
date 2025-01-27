import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { PageManagement } from "@/components/admin/PageManagement";
import { FileManagement } from "@/components/admin/FileManagement";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Package, Users, FileText, ShoppingCart, Settings, Files } from "lucide-react";
import Dashboard from "./Dashboard";
import SiteSettings from "./SiteSettings";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkAdminAccess();
  }, [navigate]);

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

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Sign out successful");
      toast.success("Signed out successfully");
      setIsAdmin(false);
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto py-4 px-2 md:px-4 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Hello, {profile?.full_name || 'Admin'} 👋
              </h1>
              <Button 
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        
          <Tabs defaultValue="dashboard" className="space-y-6">
            <div className="w-full overflow-x-auto pb-2">
              <TabsList className="w-full grid grid-cols-7 gap-1">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3 px-4">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="hidden md:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2 py-3 px-4">
                  <Package className="h-5 w-5" />
                  <span className="hidden md:inline">Products</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2 py-3 px-4">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden md:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 py-3 px-4">
                  <Users className="h-5 w-5" />
                  <span className="hidden md:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="pages" className="flex items-center gap-2 py-3 px-4">
                  <FileText className="h-5 w-5" />
                  <span className="hidden md:inline">Pages</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2 py-3 px-4">
                  <Files className="h-5 w-5" />
                  <span className="hidden md:inline">Files</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 py-3 px-4">
                  <Settings className="h-5 w-5" />
                  <span className="hidden md:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>

              <TabsContent value="products">
                <ProductManagement />
              </TabsContent>

              <TabsContent value="orders">
                <OrderManagement />
              </TabsContent>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              <TabsContent value="pages">
                <PageManagement />
              </TabsContent>

              <TabsContent value="files">
                <FileManagement />
              </TabsContent>

              <TabsContent value="settings">
                <SiteSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;