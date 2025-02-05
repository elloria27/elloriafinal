import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBuilder } from "@/components/admin/page-builder/PageBuilder";
import { MediaManager } from "@/components/admin/media/MediaManager";
import { Settings } from "@/components/admin/settings/Settings";
import { Products } from "@/components/admin/products/Products";
import { Orders } from "@/components/admin/orders/Orders";
import { Users } from "@/components/admin/users/Users";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pages");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleMediaSelect = (url: string) => {
    console.log("Selected media:", url);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="pages" className="space-y-4">
            <PageBuilder />
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
            <Products />
          </TabsContent>
          <TabsContent value="orders" className="space-y-4">
            <Orders />
          </TabsContent>
          <TabsContent value="media" className="space-y-4">
            <MediaManager />
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Users />
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;