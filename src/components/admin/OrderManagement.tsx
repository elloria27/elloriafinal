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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OrderData, OrderStatus, ShippingAddress, OrderItem } from "@/types/order";
import { useIsMobile } from "@/hooks/use-mobile";

const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const validateShippingAddress = (address: unknown): ShippingAddress => {
  console.log("Validating shipping address:", address);
  
  if (typeof address !== 'object' || !address) {
    console.error("Invalid shipping address format - not an object:", address);
    throw new Error('Invalid shipping address format');
  }
  
  const typedAddress = address as Record<string, unknown>;
  
  if (
    typeof typedAddress.address !== 'string' ||
    typeof typedAddress.region !== 'string' ||
    typeof typedAddress.country !== 'string' ||
    typeof typedAddress.phone !== 'string'
  ) {
    console.error("Missing required shipping address fields:", typedAddress);
    throw new Error('Missing required shipping address fields');
  }

  const validatedAddress: ShippingAddress = {
    address: typedAddress.address,
    region: typedAddress.region,
    country: typedAddress.country,
    phone: typedAddress.phone,
    first_name: typeof typedAddress.first_name === 'string' ? typedAddress.first_name : undefined,
    last_name: typeof typedAddress.last_name === 'string' ? typedAddress.last_name : undefined,
    email: typeof typedAddress.email === 'string' ? typedAddress.email : undefined,
  };

  console.log("Validated shipping address:", validatedAddress);
  return validatedAddress;
};

const validateOrderItems = (items: unknown): OrderItem[] => {
  console.log("Validating order items:", items);
  
  if (!Array.isArray(items)) {
    console.error("Items must be an array:", items);
    throw new Error('Items must be an array');
  }

  const validatedItems = items.map((item, index) => {
    console.log(`Validating item ${index}:`, item);
    
    if (
      typeof item !== 'object' ||
      !item ||
      typeof (item as any).id !== 'string' ||
      typeof (item as any).name !== 'string' ||
      typeof (item as any).quantity !== 'number' ||
      typeof (item as any).price !== 'number'
    ) {
      console.error(`Invalid order item format at index ${index}:`, item);
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

  console.log("Validated order items:", validatedItems);
  return validatedItems;
};

const validateOrderStatus = (status: string): OrderStatus => {
  console.log("Validating order status:", status);
  
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    console.error(`Invalid order status: ${status}`);
    throw new Error(`Invalid order status: ${status}`);
  }
  return status as OrderStatus;
};

export const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();

  const fetchOrders = async () => {
    try {
      console.log("Starting to fetch orders...");
      
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*, profiles(id, full_name, email)")
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders from Supabase:", error);
        toast.error("Failed to fetch orders");
        return;
      }

      console.log("Raw orders data from Supabase:", ordersData);

      if (!ordersData) {
        console.log("No orders data returned from Supabase");
        setOrders([]);
        return;
      }

      const validatedOrders: OrderData[] = ordersData.map((order, index) => {
        console.log(`Processing order ${index}:`, order);
        
        try {
          const shippingAddress = validateShippingAddress(order.shipping_address);
          const billingAddress = validateShippingAddress(order.billing_address);
          const items = validateOrderItems(order.items);
          const status = validateOrderStatus(order.status);

          const validatedOrder: OrderData = {
            id: order.id,
            user_id: order.user_id,
            profile_id: order.profile_id,
            order_number: order.order_number,
            total_amount: Number(order.total_amount),
            status: status,
            shipping_address: shippingAddress,
            billing_address: billingAddress,
            items: items,
            created_at: order.created_at,
            payment_method: order.payment_method || 'Not specified',
            stripe_session_id: order.stripe_session_id,
            profile: order.profiles ? {
              full_name: order.profiles.full_name || 'Guest',
              email: order.profiles.email || 'Anonymous Order'
            } : {
              full_name: `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || 'Guest',
              email: shippingAddress.email || 'Anonymous Order'
            }
          };

          console.log(`Successfully validated order ${index}:`, validatedOrder);
          return validatedOrder;
        } catch (error) {
          console.error(`Error validating order ${index}:`, error, order);
          throw error;
        }
      });

      console.log("Final validated orders:", validatedOrders);
      setOrders(validatedOrders);
    } catch (error) {
      console.error("Unexpected error in fetchOrders:", error);
      toast.error("An unexpected error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      console.log("Starting order status update:", { orderId, newStatus });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session found");
        toast.error("You must be logged in to update orders");
        return;
      }

      // Find the current order to preserve payment information
      const currentOrder = orders.find(order => order.id === orderId);
      if (!currentOrder) {
        console.error("Order not found");
        toast.error("Order not found");
        return;
      }

      // First update the order status in the database
      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          // Preserve existing payment information
          payment_method: currentOrder.payment_method,
          stripe_session_id: currentOrder.stripe_session_id
        })
        .eq("id", orderId)
        .select(`
          *,
          profiles:profiles!left(
            id,
            full_name,
            email
          )
        `)
        .single();

      if (updateError) {
        console.error("Error updating order:", updateError);
        toast.error("Failed to update order status");
        return;
      }

      console.log("Order updated successfully:", updatedOrder);

      // Validate the updated order data
      const validatedOrder: OrderData = {
        id: updatedOrder.id,
        user_id: updatedOrder.user_id,
        profile_id: updatedOrder.profile_id,
        order_number: updatedOrder.order_number,
        total_amount: updatedOrder.total_amount,
        status: validateOrderStatus(updatedOrder.status),
        shipping_address: validateShippingAddress(updatedOrder.shipping_address),
        billing_address: validateShippingAddress(updatedOrder.billing_address),
        items: validateOrderItems(updatedOrder.items),
        created_at: updatedOrder.created_at,
        payment_method: updatedOrder.payment_method,
        stripe_session_id: updatedOrder.stripe_session_id,
        profile: updatedOrder.profiles || undefined
      };

      // Update the orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? validatedOrder : order
        )
      );

      // Update selected order if it's currently being viewed
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(validatedOrder);
      }

      // Send email notification
      try {
        console.log("Attempting to send email notification");
        const customerEmail = validatedOrder.profile?.email || validatedOrder.shipping_address.email;
        const customerName = validatedOrder.profile?.full_name || 
          `${validatedOrder.shipping_address.first_name || ''} ${validatedOrder.shipping_address.last_name || ''}`.trim() || 
          'Valued Customer';

        if (customerEmail) {
          console.log("Sending email to:", customerEmail);
          const { data: emailData, error: emailError } = await supabase.functions.invoke(
            'send-order-status-email',
            {
              body: {
                customerEmail,
                customerName,
                orderId: validatedOrder.id,
                orderNumber: validatedOrder.order_number,
                newStatus: validatedOrder.status
              }
            }
          );

          if (emailError) {
            console.error('Failed to send email notification:', emailError);
            throw emailError;
          }

          console.log('Email notification sent successfully:', emailData);
        } else {
          console.warn('No customer email found for order:', validatedOrder.id);
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        toast.error('Order updated but failed to send email notification');
        return;
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

  const getPaymentStatusBadge = (order: OrderData) => {
    const baseClasses = "whitespace-nowrap text-xs px-2 py-1 rounded-full font-medium";
    
    if (order.stripe_session_id) {
      return (
        <Badge className={`${baseClasses} bg-green-500 text-white`}>
          {isMobile ? "Stripe" : "Paid with Stripe"}
        </Badge>
      );
    }
    if (order.payment_method === 'cash_on_delivery') {
      return (
        <Badge className={`${baseClasses} bg-yellow-500 text-white`}>
          {isMobile ? "Cash" : "Cash on Delivery"}
        </Badge>
      );
    }
    return (
      <Badge className={`${baseClasses} bg-gray-500 text-white`}>
        {isMobile ? "Pending" : "Payment Pending"}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading orders...</div>;
  }

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
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.order_number}</TableCell>
              <TableCell>
                {order.user_id ? (
                  order.profile?.full_name || 'N/A'
                ) : (
                  `${order.shipping_address.first_name || ''} ${order.shipping_address.last_name || ''}`.trim() || 'Guest'
                )}
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
              <TableCell>{getPaymentStatusBadge(order)}</TableCell>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <p>Order Number: {selectedOrder.order_number}</p>
                  <p>Date: {formatDate(selectedOrder.created_at)}</p>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Total: {formatCurrency(selectedOrder.total_amount)}</p>
                  <p>Payment Method: {getPaymentStatusBadge(selectedOrder)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p>Name: {selectedOrder.user_id ? (
                    selectedOrder.profile?.full_name || 'N/A'
                  ) : (
                    `${selectedOrder.shipping_address.first_name || ''} ${selectedOrder.shipping_address.last_name || ''}`.trim() || 'Guest'
                  )}</p>
                  <p>Email: {selectedOrder.user_id ? (
                    selectedOrder.profile?.email || 'N/A'
                  ) : (
                    selectedOrder.shipping_address.email || 'N/A'
                  )}</p>
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