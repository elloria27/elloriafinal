
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
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { PromoCodeManagement } from "@/components/admin/PromoCodeManagement";
import { PaymentMethodManagement } from "@/components/admin/shop/PaymentMethodManagement";
import { DeliveryMethodManagement } from "@/components/admin/shop/DeliveryMethodManagement";
import { DonationManagement } from "@/components/admin/DonationManagement";
import { InventoryManagement } from "@/components/admin/shop/InventoryManagement";
import PersonalReminders from "@/components/admin/reminders/PersonalReminders";
import TaskManagement from "@/components/admin/tasks/TaskManagement";
import Dashboard from "@/pages/admin/Dashboard";
import SiteSettings from "@/pages/admin/SiteSettings";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseManagement } from "@/components/admin/shop/expenses/ExpenseManagement";

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
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
      case "media":
        return <MediaLibrary />;
      case "settings":
        return <SiteSettings />;
      case "promo-codes":
        return <PromoCodeManagement />;
      case "payment-methods":
        return <PaymentMethodManagement />;
      case "delivery-methods":
        return <DeliveryMethodManagement />;
      case "donations":
        return <DonationManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "personal-reminders":
        return <PersonalReminders />;
      case "tasks":
        return <TaskManagement />;
      case "company-expenses":
        return <ExpenseManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <AdminSidebar profile={profile} onClose={() => {}} />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-64 flex-shrink-0">
            <AdminSidebar profile={profile} />
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto">
          <main className="p-6">
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
