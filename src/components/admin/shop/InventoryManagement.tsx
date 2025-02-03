import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const InventoryManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  const [totalValue, setTotalValue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [overStockCount, setOverStockCount] = useState(0);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          navigate("/login?redirectTo=/admin/inventory");
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
          setProfile(profileData);
        }

        const { data: roleData, error: roleError } = await supabase
          .rpc('is_admin', {
            user_id: session.user.id
          });

        if (roleError) {
          throw roleError;
        }

        if (!roleData) {
          navigate("/");
          return;
        }

        setIsAdmin(true);
        fetchInventoryData();

      } catch (error) {
        console.error('Admin access check failed:', error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const fetchInventoryData = async () => {
    try {
      const { data: inventoryData, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product:products(name)
        `);

      if (error) throw error;

      setInventory(inventoryData || []);
      
      // Calculate metrics
      let total = 0;
      let lowStock = 0;
      let overStock = 0;

      inventoryData?.forEach((item) => {
        total += (item.quantity * (item.unit_cost || 0));
        if (item.quantity <= (item.low_stock_threshold || 0)) lowStock++;
        if (item.quantity >= (item.optimal_stock || 0)) overStock++;
      });

      setTotalValue(total);
      setLowStockCount(lowStock);
      setOverStockCount(overStock);

    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="fixed left-0 top-0 h-full w-64">
          <AdminSidebar profile={profile} />
        </div>
      )}
      
      <main className={`${isMobile ? 'pt-16' : ''} px-4 md:px-6 md:ml-64`}>
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Inventory Management</h1>
              <p className="text-gray-600 text-sm md:text-base">Manage product inventory levels and track stock movements</p>
            </div>

            <div className="grid gap-4 md:gap-6">
              <Card className="p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-2">Total Inventory Value</h3>
                <p className="text-2xl md:text-3xl font-bold">${totalValue.toFixed(2)}</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
                    Low Stock Items
                    <span className="text-red-500">↘</span>
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold">{lowStockCount}</p>
                </Card>

                <Card className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
                    Over Stock Items
                    <span className="text-yellow-500">↗</span>
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold">{overStockCount}</p>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full md:w-auto overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="adjustment">Stock Adjustment</TabsTrigger>
                <TabsTrigger value="logs">Movement Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 whitespace-nowrap">Product Name</th>
                          <th className="text-left p-4 whitespace-nowrap">SKU</th>
                          <th className="text-left p-4 whitespace-nowrap">Location</th>
                          <th className="text-left p-4 whitespace-nowrap">Current Stock</th>
                          <th className="text-left p-4 whitespace-nowrap">Reorder Point</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="p-4 whitespace-nowrap">{item.product?.name}</td>
                            <td className="p-4 whitespace-nowrap">{item.sku || '-'}</td>
                            <td className="p-4 whitespace-nowrap">{item.location || '-'}</td>
                            <td className="p-4 whitespace-nowrap">{item.quantity}</td>
                            <td className="p-4 whitespace-nowrap">{item.reorder_point || 50}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="adjustment">
                <Card className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4">Stock Adjustment</h3>
                  {/* Stock adjustment form will be implemented here */}
                </Card>
              </TabsContent>

              <TabsContent value="logs">
                <Card className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4">Movement Logs</h3>
                  {/* Movement logs table will be implemented here */}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};