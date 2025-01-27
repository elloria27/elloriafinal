import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

type Order = Tables<"orders", never>;
type Profile = Tables<"profiles", never>;

export const Activity = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to view your activity");
        return;
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading activity...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Activity</h2>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No recent activity</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Order #{order.order_number}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {order.created_at && format(new Date(order.created_at), 'PPP')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Order Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};