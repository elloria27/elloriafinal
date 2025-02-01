import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderData, OrderStatus, ShippingAddress } from "@/types/order";

export default function Activity() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.email) {
          console.log("No user email found");
          return;
        }

        console.log("Fetching orders for email:", session.user.email);
        
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*')
          .or(`shipping_address->>'email'.eq.${session.user.email},billing_address->>'email'.eq.${session.user.email},profile_id.eq.${session.user.id},user_id.eq.${session.user.id}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          toast({
            title: "Error",
            description: "Failed to fetch orders. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched orders:", ordersData);
        
        // Transform the data to match OrderData type
        const transformedOrders: OrderData[] = (ordersData || []).map(order => ({
          ...order,
          status: order.status as OrderStatus,
          items: Array.isArray(order.items) ? order.items : [],
          shipping_address: order.shipping_address as ShippingAddress,
          billing_address: order.billing_address as ShippingAddress,
          applied_promo_code: order.applied_promo_code || null,
          shipping_cost: order.shipping_cost || 0,
          gst: order.gst || 0
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
              <p className="text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm capitalize bg-primary/10 text-primary">
              {order.status}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span>${order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}