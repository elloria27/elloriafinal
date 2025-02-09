
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderData, OrderStatus, ShippingAddress, OrderItem, AppliedPromoCode } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";
import { Product } from "@/types/product";
import { parseProduct } from "@/utils/supabase-helpers";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

export default function Invoices() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      const productsMap = productsData.reduce((acc, product) => {
        acc[product.id] = parseProduct(product);
        return acc;
      }, {} as Record<string, Product>);

      setProducts(productsMap);
    };

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
        
        const transformedOrders: OrderData[] = (ordersData || []).map(order => ({
          ...order,
          status: order.status as OrderStatus,
          items: Array.isArray(order.items) ? order.items.map((item: any) => ({
            id: item.id || '',
            name: products[item.id]?.name || item.name || '',
            quantity: item.quantity || 0,
            price: item.price || 0,
            image: products[item.id]?.image || item.image || undefined
          })) : [],
          shipping_address: order.shipping_address as ShippingAddress,
          billing_address: order.billing_address as ShippingAddress,
          applied_promo_code: order.applied_promo_code ? {
            code: (order.applied_promo_code as any).code || '',
            type: (order.applied_promo_code as any).type || 'fixed_amount',
            value: (order.applied_promo_code as any).value || 0
          } as AppliedPromoCode : null,
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

    fetchProducts().then(fetchOrders);
  }, []);

  const handleDownload = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { orderId }
      });

      if (error) throw error;

      // Convert base64 to blob
      const pdfContent = data.pdf.split(',')[1];
      const blob = new Blob([Uint8Array.from(atob(pdfContent), c => c.charCodeAt(0))], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
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

  const handleSendEmail = async (orderId: string) => {
    try {
      setSending(orderId);
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: { orderId }
      });

      if (error) throw error;
      toast({
        title: "Success",
        description: "Invoice sent successfully",
      });
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast({
        title: "Error",
        description: "Failed to send invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6">No invoices found.</div>;
  }

  return (
    <div className="space-y-8 p-6 pt-24">
      <div ref={printRef}>
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Invoice #{order.order_number}</h3>
                <p className="text-gray-600">
                  {format(new Date(order.created_at), "PPP")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(order.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendEmail(order.id)}
                  disabled={sending === order.id}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {sending === order.id ? "Sending..." : "Email"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="pt-4">
                <div className="flex justify-between font-medium">
                  <span>Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between font-medium mt-2">
                  <span>Total Amount</span>