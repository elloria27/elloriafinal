import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@supabase/auth-helpers-react";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Invoices() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!auth?.user?.email) {
          console.log("No user email found");
          return;
        }

        console.log("Fetching orders for email:", auth.user.email);
        
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .or(`shipping_address->>'email'.eq.'${auth.user.email}',billing_address->>'email'.eq.'${auth.user.email}',profile_id.eq.${auth.user.id},user_id.eq.${auth.user.id}`)
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

        console.log("Fetched orders:", orders);
        setOrders(orders || []);
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
  }, [auth?.user?.email]);

  const handleDownload = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { orderId }
      });

      if (error) throw error;

      // Handle the PDF download here
      console.log("Invoice generated:", data);
      
      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return <div>No invoices found.</div>;
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
              <h3 className="text-lg font-semibold">Invoice #{order.order_number}</h3>
              <p className="text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(order.id)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="pt-4">
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