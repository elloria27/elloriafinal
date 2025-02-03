import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InventoryAdjustment } from "./inventory/InventoryAdjustment";
import { InventoryList } from "./inventory/InventoryList";
import { InventoryLogs } from "./inventory/InventoryLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseProduct } from "@/utils/supabase-helpers";
import { useIsMobile } from "@/hooks/use-mobile";

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  product: Product;
}

export const InventoryManagement = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session, redirecting to login');
          navigate("/login?redirectTo=/admin/inventory");
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
        fetchInventory();
      } catch (error) {
        console.error('Admin access check failed:', error);
        toast.error("Error verifying admin access");
        navigate("/");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const fetchInventory = async () => {
    try {
      console.log("Fetching inventory...");
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          *,
          product:products(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inventory:", error);
        toast.error("Failed to fetch inventory");
        return;
      }

      console.log("Inventory fetched successfully:", data);
      const parsedInventory = data.map(item => ({
        ...item,
        product: parseProduct(item.product)
      }));
      setInventory(parsedInventory);
    } catch (error) {
      console.error("Error in fetchInventory:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Inventory Management</h2>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="adjust">Stock Adjustment</TabsTrigger>
          <TabsTrigger value="logs">Adjustment Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryList inventory={inventory} onRefresh={fetchInventory} />
        </TabsContent>

        <TabsContent value="adjust" className="space-y-4">
          <InventoryAdjustment inventory={inventory} onUpdate={fetchInventory} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <InventoryLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};