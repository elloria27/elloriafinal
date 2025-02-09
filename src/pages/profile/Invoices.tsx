
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderData, OrderStatus, ShippingAddress, OrderItem, AppliedPromoCode } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer, RefreshCw } from "lucide-react";
import { Product } from "@/types/product";
import { parseProduct } from "@/utils/supabase-helpers";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Invoices() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) {
        console.error("Error fetching products:", productsError);
        return;
      }

      const productsMap = productsData.reduce((acc, product) => {
        acc[product.id] = parseProduct(product);
        return acc;
      }, {} as Record<string, Product>);

      setProducts(productsMap);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.email) {
        console.log("No user email found");
        return;
      }

      console.log("Fetching orders for email:", session.user.email);
      
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:profiles!left(*)
        `)
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

  useEffect(() => {
    fetchOrders();
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

  const handlePrint = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { orderId }
      });

      if (error) throw error;

      // Convert base64 to blob and create URL
      const pdfContent = data.pdf.split(',')[1];
      const blob = new Blob([Uint8Array.from(atob(pdfContent), c => c.charCodeAt(0))], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open print dialog
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = function() {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error("Error preparing invoice for print:", error);
      toast({
        title: "Error",
        description: "Failed to prepare invoice for printing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async (orderId: string) => {
    try {
      setSendingEmail(true);
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: { invoiceId: orderId }
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
      setSendingEmail(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6">No invoices found.</div>;
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-8 p-6 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Invoices</h2>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Invoice #{order.order_number}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <Badge className={`mt-2 ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrint(order.id)}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(order.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendEmail(order.id)}
                  disabled={sendingEmail}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>${order.total_amount}</span>
                </div>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-blue-600"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[540px]">
                  {selectedOrder && (
                    <>
                      <SheetHeader>
                        <SheetTitle>Invoice #{selectedOrder.order_number}</SheetTitle>
                        <SheetDescription>
                          Created on {format(new Date(selectedOrder.created_at), "PPP")}
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                          <h4 className="font-medium">Items</h4>
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} × {item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Shipping Address</h4>
                          <p className="text-sm">
                            {selectedOrder.shipping_address.address}<br />
                            {selectedOrder.shipping_address.region}, {selectedOrder.shipping_address.country}
                          </p>
                        </div>

                        {selectedOrder.applied_promo_code && (
                          <div className="space-y-1">
                            <h4 className="font-medium">Applied Discount</h4>
                            <p className="text-sm">
                              Code: {selectedOrder.applied_promo_code.code}<br />
                              Discount: {selectedOrder.applied_promo_code.type === 'percentage' 
                                ? `${selectedOrder.applied_promo_code.value}%` 
                                : `$${selectedOrder.applied_promo_code.value}`}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${selectedOrder.total_amount - (selectedOrder.shipping_cost || 0) - (selectedOrder.gst || 0)}</span>
                          </div>
                          {selectedOrder.shipping_cost > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Shipping</span>
                              <span>${selectedOrder.shipping_cost}</span>
                            </div>
                          )}
                          {selectedOrder.gst > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>GST</span>
                              <span>${selectedOrder.gst}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium pt-2 border-t">
                            <span>Total</span>
                            <span>${selectedOrder.total_amount}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
