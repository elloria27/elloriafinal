import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, products, orders, posts] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("products").select("*", { count: "exact" }),
        supabase.from("orders").select("*", { count: "exact" }),
        supabase.from("posts").select("*", { count: "exact" }),
      ]);

      return {
        users: users.count || 0,
        products: products.count || 0,
        orders: orders.count || 0,
        posts: posts.count || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{stats?.users || 0}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold mt-2">{stats?.products || 0}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{stats?.orders || 0}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium text-gray-500">Total Posts</h3>
          <p className="text-3xl font-bold mt-2">{stats?.posts || 0}</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;