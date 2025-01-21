import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Review = Tables<"reviews">;
type Order = Tables<"orders">;

type ActivityItem = {
  type: 'review' | 'order';
  date: string;
  data: Review | Order;
};

export default function Activity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch reviews
        const { data: reviews } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Combine and sort activities
        const allActivities: ActivityItem[] = [
          ...(reviews?.map(review => ({
            type: 'review' as const,
            date: review.created_at,
            data: review
          })) || []),
          ...(orders?.map(order => ({
            type: 'order' as const,
            date: order.created_at,
            data: order
          })) || [])
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50 pt-24">
          <AccountSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h1>
              <div className="bg-white rounded-lg shadow-sm divide-y">
                {loading ? (
                  <div className="p-6">Loading...</div>
                ) : activities.length === 0 ? (
                  <div className="p-6 text-gray-500">No recent activity.</div>
                ) : (
                  activities.map((activity, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {activity.type === 'review' ? (
                              `Wrote a review (${(activity.data as Review).rating} stars)`
                            ) : (
                              `Placed order #${(activity.data as Order).order_number}`
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(activity.date), 'PPP')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </>
  );
}