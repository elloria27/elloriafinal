import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Package, 
  FileText, 
  Upload,
  Camera,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Dashboard from "./Dashboard";
import SiteSettings from "./SiteSettings";
import { UserManagement } from "@/components/admin/UserManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { PageManagement } from "@/components/admin/PageManagement";
import { FileManagement } from "@/components/admin/FileManagement";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { OrderManagement } from "@/components/admin/OrderManagement";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("Please login to access admin panel");
          navigate("/login?redirectTo=/admin");
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError || !roleData || roleData.role !== 'admin') {
          toast.error("Access denied - Admin privileges required");
          navigate("/");
          return;
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        toast.error("Error verifying admin access");
        navigate("/");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <ScrollArea className="w-full mb-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Pages</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <Card className="p-4">
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
          <TabsContent value="pages">
            <PageManagement />
          </TabsContent>
          <TabsContent value="files">
            <FileManagement />
          </TabsContent>
          <TabsContent value="media">
            <MediaLibrary />
          </TabsContent>
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
          <TabsContent value="settings">
            <SiteSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Admin;