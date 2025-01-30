import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/admin/dashboard/WeatherWidget";
import { AnalyticsWidget } from "@/components/admin/dashboard/AnalyticsWidget";
import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface DashboardCounts {
  users: number;
  orders: number;
  revenue: number;
  products: number;
}

type Order = Tables<'orders', 'Row'>;

const Dashboard = () => {
  const [counts, setCounts] = useState<DashboardCounts>({
    users: 0,
    orders: 0,
    revenue: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;
        
        // Fetch only paid orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('status', 'paid');

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          throw ordersError;
        }

        console.log('Fetched paid orders:', orders);
        
        // Calculate total revenue from paid orders
        const totalRevenue = orders?.reduce((sum, order: Order) => {
          return sum + (order.total_amount || 0);
        }, 0) || 0;

        console.log('Calculated total revenue:', totalRevenue);
        console.log('Total number of paid orders:', orders?.length || 0);
        
        // Fetch products count
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productsError) throw productsError;

        setCounts({
          users: usersCount || 0,
          orders: orders?.length || 0,
          revenue: totalRevenue,
          products: productsCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : counts.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : counts.orders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatCurrency(counts.revenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : counts.products}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherWidget />
        <AnalyticsWidget />
      </div>
    </div>
  );
};

export default Dashboard;
