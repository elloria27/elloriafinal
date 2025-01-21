import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { toast } from "sonner";

type Order = Tables<"orders">;

export default function Invoices() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please log in to view your orders");
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          toast.error("Failed to load orders");
          throw error;
        }
        
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50 pt-24">
          <AccountSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Orders & Invoices</h1>
              <div className="bg-white rounded-lg shadow-sm divide-y">
                {loading ? (
                  <div className="p-6 text-center">Loading your orders...</div>
                ) : orders.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No orders found.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900">Order #{order.order_number}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(order.created_at), 'PPP')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: <span className="capitalize">{order.status}</span>
                          </p>
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                            <ul className="mt-1 space-y-1">
                              {order.items?.map((item: any, index: number) => (
                                <li key={index} className="text-sm text-gray-600">
                                  {item.name} x {item.quantity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(Number(order.total_amount))}
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