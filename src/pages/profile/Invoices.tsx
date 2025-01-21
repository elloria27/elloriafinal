import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

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

  const downloadInvoice = (order: Order) => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text('Invoice', 20, 20);
      
      // Add order details
      doc.setFontSize(12);
      doc.text(`Order Number: ${order.order_number}`, 20, 40);
      doc.text(`Date: ${format(new Date(order.created_at), 'PPP')}`, 20, 50);
      doc.text(`Status: ${order.status}`, 20, 60);
      
      // Add shipping address
      if (order.shipping_address) {
        doc.text('Shipping Address:', 20, 80);
        doc.text(`${order.shipping_address.address}`, 20, 90);
        doc.text(`${order.shipping_address.region}, ${order.shipping_address.country}`, 20, 100);
        doc.text(`Phone: ${order.shipping_address.phone}`, 20, 110);
      }
      
      // Add items
      doc.text('Items:', 20, 130);
      let yPos = 140;
      order.items?.forEach((item: any, index: number) => {
        doc.text(`${item.name} x ${item.quantity}`, 20, yPos);
        yPos += 10;
      });
      
      // Add total
      doc.text(`Total Amount: ${formatCurrency(Number(order.total_amount))}`, 20, yPos + 20);
      
      // Save the PDF
      doc.save(`invoice-${order.order_number}.pdf`);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download invoice');
    }
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
                        <div className="text-right space-y-2">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(Number(order.total_amount))}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => downloadInvoice(order)}
                          >
                            <Download className="h-4 w-4" />
                            Download Invoice
                          </Button>
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