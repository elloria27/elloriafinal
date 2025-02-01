import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { Package, ShoppingCart } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  date: string;
  details: any;
}

export default function Activity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        console.log("Fetching user activity...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found");
          toast.error("Please log in to view your activity");
          return;
        }

        console.log("Current user ID:", user.id);
        
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .or(`user_id.eq.${user.id}, profile_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching activity:', error);
          throw error;
        }

        console.log("Raw orders data:", orders);

        const activityItems = orders?.map(order => ({
          id: order.id,
          type: 'order',
          date: order.created_at,
          details: {
            orderNumber: order.order_number,
            status: order.status,
            total: order.total_amount,
            items: order.items
          }
        })) || [];

        console.log("Processed activity items:", activityItems);
        setActivities(activityItems);
      } catch (error) {
        console.error('Error fetching activity:', error);
        toast.error("Failed to load activity");
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Recent Activity</h1>
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {loading ? (
          <div className="p-6 text-center">Loading your activity...</div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No recent activity found.</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {activity.type === 'order' ? (
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  ) : (
                    <Package className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Order #{activity.details.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(activity.date), 'PPP')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(Number(activity.details.total))}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {activity.details.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                    <ul className="mt-1 space-y-1">
                      {activity.details.items.map((item: any, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}