import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, DollarSign, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        console.log('Fetching dashboard statistics...');
        
        // Fetch total users
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch total orders and revenue
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('total_amount');

        if (ordersError) throw ordersError;

        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

        // Fetch total products
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productsError) throw productsError;

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue: totalRevenue,
          totalProducts: productsCount || 0,
        });

        console.log('Dashboard statistics loaded:', {
          users: usersCount,
          orders: orders?.length,
          revenue: totalRevenue,
          products: productsCount
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} ${card.color} p-2 rounded-full`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;