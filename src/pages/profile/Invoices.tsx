
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderData, OrderStatus, ShippingAddress, OrderItem, AppliedPromoCode } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Product } from "@/types/product";
import { parseProduct } from "@/utils/supabase-helpers";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Invoices() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<OrderData | null>(null);
  const [viewOrderDialogOpen, setViewOrderDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  // Format currency with 2 decimal places
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="p-6 pt-24 text-center">No invoices found.</div>;
  }

  return (
    <div className={`space-y-8 p-6 ${isMobile ? 'pt-20' : 'pt-24'}`}>
      {orders.map((order) => (
        <div
          key={order.id}
          className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isMobile ? 'p-4' : ''}`}
        >
          <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-start'} mb-4`}>
            <div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Invoice #{order.order_number}</h3>
              <p className="text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className={`flex gap-2 ${isMobile ? 'mt-4' : ''}`}>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={() => {
                  setViewingOrder(order);
                  setViewOrderDialogOpen(true);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={() => handleDownload(order.id)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="pt-4">
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span>{formatAmount(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Order Details Dialog */}
      <Dialog open={viewOrderDialogOpen} onOpenChange={setViewOrderDialogOpen}>
        <DialogContent className={isMobile ? "w-[95%] max-w-full p-4" : ""}>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Invoice Number</h3>
                  <p>{viewingOrder.order_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{new Date(viewingOrder.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{formatAmount(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatAmount(viewingOrder.total_amount - (viewingOrder.gst || 0) - (viewingOrder.shipping_cost || 0))}</span>
                </div>
                {viewingOrder.shipping_cost > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatAmount(viewingOrder.shipping_cost)}</span>
                  </div>
                )}
                {viewingOrder.gst > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatAmount(viewingOrder.gst)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t mt-2 pt-2">
                  <span>Total</span>
                  <span>{formatAmount(viewingOrder.total_amount)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                {viewingOrder.shipping_address && (
                  <>
                    <p>{viewingOrder.shipping_address.first_name} {viewingOrder.shipping_address.last_name}</p>
                    <p>{viewingOrder.shipping_address.address}</p>
                    <p>
                      {viewingOrder.shipping_address.city}, {viewingOrder.shipping_address.region} {viewingOrder.shipping_address.postal_code}
                    </p>
                    <p>{viewingOrder.shipping_address.country}</p>
                  </>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={() => handleDownload(viewingOrder.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
