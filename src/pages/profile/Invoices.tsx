import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderData, OrderStatus } from "@/types/order";

export default function Invoices() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        console.log("Fetching orders for current user...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found");
          toast.error("Please log in to view your orders");
          return;
        }

        console.log("Current user ID:", user.id);
        console.log("Current user email:", user.email);
        
        // First try to fetch by user_id
        let { data: userOrders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        // If no orders found by user_id, try email_address
        if ((!userOrders || userOrders.length === 0) && user.email) {
          console.log("No orders found by user_id, trying email...");
          const { data: emailOrders, error: emailError } = await supabase
            .from("orders")
            .select("*")
            .eq("email_address", user.email)
            .order("created_at", { ascending: false });

          if (emailError) throw emailError;
          userOrders = emailOrders;
        }

        if (error) {
          console.error("Error fetching orders:", error);
          throw error;
        }

        console.log("Fetched orders:", userOrders);
        
        // Transform the data to match OrderData type
        const transformedOrders: OrderData[] = (userOrders || []).map(order => ({
          ...order,
          // Ensure status is of type OrderStatus
          status: order.status as OrderStatus,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
          shipping_address: typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address,
          billing_address: typeof order.billing_address === 'string' 
            ? JSON.parse(order.billing_address) 
            : order.billing_address,
          applied_promo_code: order.applied_promo_code 
            ? (typeof order.applied_promo_code === 'string' 
              ? JSON.parse(order.applied_promo_code) 
              : order.applied_promo_code)
            : null,
          // Ensure numeric fields are properly typed
          total_amount: Number(order.total_amount),
          shipping_cost: Number(order.shipping_cost || 0),
          gst: Number(order.gst || 0)
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Package className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-gray-500">Start shopping to see your orders here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Orders & Invoices</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{order.order_number}
                </h3>
                <p className="mt-1 text-gray-500">
                  Placed on {format(new Date(order.created_at), "PPP")}
                </p>
                <p className="mt-2 text-sm">
                  {order.items?.length || 0} items
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="font-medium text-gray-900">
                  ${order.total_amount.toFixed(2)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.info("Invoice download coming soon!");
                  }}
                >
                  Download Invoice
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}