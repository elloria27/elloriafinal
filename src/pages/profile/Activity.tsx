import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Package } from "lucide-react";
import type { OrderStatus } from "@/types/order";

interface ActivityItem {
  id: string;
  type: string;
  date: string;
  title: string;
  description: string;
  status: OrderStatus;
}

export default function Activity() {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        console.log("Fetching orders for current user...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found");
          toast.error("Please log in to view your activity");
          return;
        }

        console.log("Current user ID:", user.id);
        
        // First, get user's profile to get their email
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", user.id)
          .single();

        const userEmail = profile?.email || user.email;
        console.log("User email for order search:", userEmail);

        // Fetch orders with expanded query and proper JSON field access
        const { data: orders, error } = await supabase
          .from("orders")
          .select(`
            *,
            profiles (
              email
            )
          `)
          .or(`user_id.eq.${user.id},profile_id.eq.${user.id},shipping_address->>'email'.eq.'${userEmail}',billing_address->>'email'.eq.'${userEmail}'`)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          throw error;
        }

        console.log("Fetched orders:", orders);

        const items = (orders || []).map(order => ({
          id: order.id,
          type: "order",
          date: order.created_at,
          title: `Order #${order.order_number}`,
          description: `Order total: $${Number(order.total_amount).toFixed(2)}`,
          status: order.status as OrderStatus
        }));

        setActivityItems(items);
      } catch (error) {
        console.error("Error fetching activity:", error);
        toast.error("Failed to load activity");
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivity();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (activityItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Package className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No activity yet</h3>
        <p className="mt-1 text-gray-500">Start shopping to see your activity here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
      <div className="space-y-6">
        {activityItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-gray-500">{item.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {format(new Date(item.date), "PPP")}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}