import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OrderData, OrderStatus, ShippingAddress, OrderItem, AppliedPromoCode } from "@/types/order";

const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const validateShippingAddress = (address: unknown): ShippingAddress => {
  if (typeof address !== 'object' || !address) {
    throw new Error('Invalid shipping address format');
  }
  
  const typedAddress = address as Record<string, unknown>;
  
  if (
    typeof typedAddress.address !== 'string' ||
    typeof typedAddress.region !== 'string' ||
    typeof typedAddress.country !== 'string' ||
    typeof typedAddress.phone !== 'string'
  ) {
    throw new Error('Missing required shipping address fields');
  }

  return {
    address: typedAddress.address,
    region: typedAddress.region,
    country: typedAddress.country,
    phone: typedAddress.phone,
    first_name: typeof typedAddress.first_name === 'string' ? typedAddress.first_name : undefined,
    last_name: typeof typedAddress.last_name === 'string' ? typedAddress.last_name : undefined,
    email: typeof typedAddress.email === 'string' ? typedAddress.email : undefined,
  };
};

const validateOrderItems = (items: unknown): OrderItem[] => {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  return items.map(item => {
    if (
      typeof item !== 'object' ||
      !item ||
      typeof (item as any).id !== 'string' ||
      typeof (item as any).name !== 'string' ||
      typeof (item as any).quantity !== 'number' ||
      typeof (item as any).price !== 'number'
    ) {
      throw new Error('Invalid order item format');
    }

    return {
      id: (item as any).id,
      name: (item as any).name,
      quantity: (item as any).quantity,
      price: (item as any).price,
      image: (item as any).image,
    };
  });
};

const validateAppliedPromoCode = (promoCode: unknown): AppliedPromoCode | null => {
  if (!promoCode || typeof promoCode !== 'object') {
    return null;
  }

  const typedPromoCode = promoCode as Record<string, unknown>;

  if (
    typeof typedPromoCode.code !== 'string' ||
    !['percentage', 'fixed_amount'].includes(typedPromoCode.type as string) ||
    typeof typedPromoCode.value !== 'number'
  ) {
    console.error('Invalid promo code format:', promoCode);
    return null;
  }

  return {
    code: typedPromoCode.code,
    type: typedPromoCode.type as 'percentage' | 'fixed_amount',
    value: typedPromoCode.value
  };
};

const validateOrderStatus = (status: string): OrderStatus => {
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error(`Invalid order status: ${status}`);
  }
  return status as OrderStatus;
};

export const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:profiles!left (
            id,
            full_name,
            email,
            phone_number,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
        return;
      }

      console.log("Raw orders data:", ordersData);

      const validatedOrders: OrderData[] = (ordersData || []).map(order => {
        try {
          const shippingAddress = validateShippingAddress(order.shipping_address);
          const validatedOrder: OrderData = {
            id: order.id,
            user_id: order.user_id,
            profile_id: order.profile_id,
            order_number: order.order_number,
            total_amount: order.total_amount,
            status: validateOrderStatus(order.status),
            shipping_address: shippingAddress,
            billing_address: validateShippingAddress(order.billing_address),
            items: validateOrderItems(order.items),
            created_at: order.created_at,
            payment_method: order.payment_method || null,
            profile: order.profiles ? {
              full_name: order.profiles.full_name || 'Guest',
              email: order.profiles.email || shippingAddress.email || 'Anonymous Order',
              phone_number: order.profiles.phone_number || shippingAddress.phone,
              address: order.profiles.address || shippingAddress.address
            } : {
              full_name: `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || 'Guest',
              email: shippingAddress.email || 'Anonymous Order',
              phone_number: shippingAddress.phone,
              address: shippingAddress.address
            },
            applied_promo_code: validateAppliedPromoCode(order.applied_promo_code),
            shipping_cost: order.shipping_cost || 0,
            gst: order.gst || 0
          };
          return validatedOrder;
        } catch (error) {
          console.error("Error validating order:", error, order);
          throw error;
        }
      });

      console.log("Validated orders:", validatedOrders);
      setOrders(validatedOrders);
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      toast.error("An unexpected error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      console.log("Generating invoice for order:", orderId);
      
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { orderId }
      });

      if (error) {
        console.error("Invoice generation error:", error);
        toast.error("Failed to generate invoice");
        return;
      }

      if (!data || !data.pdf) {
        console.error("No PDF data received");
        toast.error("Failed to generate invoice");
        return;
      }

      console.log("Received PDF data, initiating download...");

      const link = document.createElement('a');
      link.href = data.pdf;
      link.download = `invoice-${selectedOrder?.order_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      console.log("Starting order status update:", { orderId, newStatus });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session found");
        toast.error("You must be logged in to update orders");
        return;
      }

      console.log("Current user session:", session.user.id);
      
      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)
        .select(`
          *,
          profiles:profiles(
            id,
            full_name,
            email,
            phone_number,
            address
          )
        `)
        .single();

      if (updateError) {
        console.error("Error updating order:", updateError);
        toast.error("Failed to update order status");
        return;
      }

      console.log("Order updated successfully:", updatedOrder);

      try {
        const shippingAddress = validateShippingAddress(updatedOrder.shipping_address);
        const customerName = updatedOrder.profiles?.full_name || 
          (shippingAddress.first_name && shippingAddress.last_name 
            ? `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim() 
            : shippingAddress.first_name || shippingAddress.last_name || 'Valued Customer');

        const emailDetails = {
          customerEmail: updatedOrder.profiles?.email || shippingAddress.email || updatedOrder.email_address,
          customerName: customerName,
          orderId: updatedOrder.id,
          orderNumber: updatedOrder.order_number,
          newStatus: newStatus
        };

        const { error: emailError } = await supabase.functions.invoke('send-order-status-email', {
          body: emailDetails
        });

        if (emailError) {
          console.error("Error sending status update email:", emailError);
        }
      } catch (emailError) {
        console.error("Error sending status update email:", emailError);
      }

      const validatedShippingAddress = validateShippingAddress(updatedOrder.shipping_address);
      const validatedOrder: OrderData = {
        id: updatedOrder.id,
        user_id: updatedOrder.user_id,
        profile_id: updatedOrder.profile_id,
        order_number: updatedOrder.order_number,
        total_amount: updatedOrder.total_amount,
        status: validateOrderStatus(updatedOrder.status),
        shipping_address: validatedShippingAddress,
        billing_address: validateShippingAddress(updatedOrder.billing_address),
        items: validateOrderItems(updatedOrder.items),
        created_at: updatedOrder.created_at,
        payment_method: updatedOrder.payment_method || null,
        profile: updatedOrder.profiles ? {
          full_name: updatedOrder.profiles.full_name || 'Guest',
          email: updatedOrder.profiles.email || validatedShippingAddress.email || 'Anonymous Order',
          phone_number: updatedOrder.profiles.phone_number || validatedShippingAddress.phone,
          address: updatedOrder.profiles.address || validatedShippingAddress.address
        } : {
          full_name: `${validatedShippingAddress.first_name || ''} ${validatedShippingAddress.last_name || ''}`.trim() || 'Guest',
          email: validatedShippingAddress.email || 'Anonymous Order',
          phone_number: validatedShippingAddress.phone,
          address: validatedShippingAddress.address
        },
        applied_promo_code: validateAppliedPromoCode(updatedOrder.applied_promo_code),
        shipping_cost: updatedOrder.shipping_cost || 0,
        gst: updatedOrder.gst || 0
      };

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? validatedOrder : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(validatedOrder);
      }

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.order_number}</TableCell>
              <TableCell>
                {order.profile?.full_name || 'Guest'}
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                  className="border rounded p-1"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                {order.payment_method === 'stripe' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Stripe
                  </span>
                ) : (
                  order.payment_method || 'Standard'
                )}
              </TableCell>
              <TableCell>{formatCurrency(order.total_amount)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailsOpen(true);
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>View and manage order information</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Order #{selectedOrder.order_number}</h3>
                <Button onClick={() => handleDownloadInvoice(selectedOrder.id)}>
                  Download Invoice
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <p>Date: {formatDate(selectedOrder.created_at)}</p>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Payment Method: {selectedOrder.payment_method === 'stripe' ? 
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Stripe
                    </span> : 
                    selectedOrder.payment_method || 'Standard'
                  }</p>
                  {selectedOrder.applied_promo_code && (
                    <div className="mt-2">
                      <p className="font-medium">Applied Promo Code:</p>
                      <p className="text-sm text-primary">{selectedOrder.applied_promo_code.code}</p>
                      <p className="text-sm text-gray-600">
                        Discount: {selectedOrder.applied_promo_code.type === 'percentage' ? 
                          `${selectedOrder.applied_promo_code.value}%` : 
                          formatCurrency(selectedOrder.applied_promo_code.value)}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p>Name: {selectedOrder.profile?.full_name || 
                    `${selectedOrder.shipping_address.first_name || ''} ${selectedOrder.shipping_address.last_name || ''}`.trim() || 
                    'Guest'}</p>
                  <p>Email: {selectedOrder.profile?.email || selectedOrder.shipping_address.email || 'N/A'}</p>
                  <p>Phone: {selectedOrder.profile?.phone_number || selectedOrder.shipping_address.phone || 'N/A'}</p>
                  <p>Address: {selectedOrder.profile?.address || selectedOrder.shipping_address.address || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">
                        Subtotal:
                      </TableCell>
                      <TableCell>
                        {formatCurrency(selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                      </TableCell>
                    </TableRow>
                    {selectedOrder.applied_promo_code && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right text-primary">
                          Discount ({selectedOrder.applied_promo_code.code}):
                        </TableCell>
                        <TableCell className="text-primary">
                          -{formatCurrency(
                            selectedOrder.applied_promo_code.type === 'percentage'
                              ? (selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * selectedOrder.applied_promo_code.value / 100)
                              : selectedOrder.applied_promo_code.value
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {selectedOrder.shipping_cost > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right">
                          Shipping:
                        </TableCell>
                        <TableCell>
                          {formatCurrency(selectedOrder.shipping_cost)}
                        </TableCell>
                      </TableRow>
                    )}
                    {selectedOrder.gst > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right">
                          GST (5%):
                        </TableCell>
                        <TableCell>
                          {formatCurrency(selectedOrder.gst)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(selectedOrder.total_amount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p>{selectedOrder.shipping_address.address}</p>
                  <p>{selectedOrder.shipping_address.region}</p>
                  <p>{selectedOrder.shipping_address.country}</p>
                  <p>Phone: {selectedOrder.shipping_address.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Billing Address</h3>
                  <p>{selectedOrder.billing_address.address}</p>
                  <p>{selectedOrder.billing_address.region}</p>
                  <p>{selectedOrder.billing_address.country}</p>
                  <p>Phone: {selectedOrder.billing_address.phone}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
