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
  if (typeof address !== 'object' || !address) {
    console.error('Invalid shipping address format:', address);
    return {
      address: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      phone: 'Unknown'
    };
  }
  
  const typedAddress = address as Record<string, unknown>;
  
  return {
    address: typeof typedAddress.address === 'string' ? typedAddress.address : 'Unknown',
    region: typeof typedAddress.region === 'string' ? typedAddress.region : 'Unknown',
    country: typeof typedAddress.country === 'string' ? typedAddress.country : 'Unknown',
    phone: typeof typedAddress.phone === 'string' ? typedAddress.phone : 'Unknown',
    first_name: typeof typedAddress.first_name === 'string' ? typedAddress.first_name : undefined,
    last_name: typeof typedAddress.last_name === 'string' ? typedAddress.last_name : undefined,
    email: typeof typedAddress.email === 'string' ? typedAddress.email : undefined,
  };
};

const validateOrderItems = (items: unknown): OrderItem[] => {
  if (!Array.isArray(items)) {
    console.error('Items is not an array:', items);
    return [];
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
      console.error('Invalid order item:', item);
      return {
        id: 'unknown',
        name: 'Unknown Product',
        quantity: 0,
        price: 0,
        image: undefined
      };
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
  const isMobile = useIsMobile();

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
            address,
            country,
            region
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
          const billingAddress = validateShippingAddress(order.billing_address);
          const items = validateOrderItems(order.items);
          
          let customerName = 'Guest';
          let customerEmail = 'Anonymous Order';
          let customerPhone = '';
          let customerAddress = '';
          let customerRegion = '';
          let customerCountry = '';
          
          // If user is authenticated and has a profile
          if (order.profiles) {
            customerName = order.profiles.full_name || 'Guest';
            customerEmail = order.profiles.email || 'Anonymous Order';
            customerPhone = order.profiles.phone_number || '';
            customerAddress = order.profiles.address || '';
            customerRegion = order.profiles.region || '';
            customerCountry = order.profiles.country || '';
          } 
          // If guest user with shipping address
          else if (shippingAddress) {
            const firstName = shippingAddress.first_name || '';
            const lastName = shippingAddress.last_name || '';
            customerName = `${firstName} ${lastName}`.trim() || 'Guest';
            customerEmail = shippingAddress.email || 'Anonymous Order';
            customerPhone = shippingAddress.phone || '';
            customerAddress = shippingAddress.address || '';
            customerRegion = shippingAddress.region || '';
            customerCountry = shippingAddress.country || '';
          }

          return {
            id: order.id,
            user_id: order.user_id,
            profile_id: order.profile_id,
            order_number: order.order_number || 'Unknown',
            total_amount: order.total_amount || 0,
            status: validateOrderStatus(order.status || 'pending'),
            shipping_address: {
              ...shippingAddress,
              phone: customerPhone || shippingAddress.phone,
              address: customerAddress || shippingAddress.address,
              region: customerRegion || shippingAddress.region,
              country: customerCountry || shippingAddress.country,
            },
            billing_address: {
              ...billingAddress,
              phone: customerPhone || billingAddress.phone,
              address: customerAddress || billingAddress.address,
              region: customerRegion || billingAddress.region,
              country: customerCountry || billingAddress.country,
            },
            items: items,
            created_at: order.created_at,
            payment_method: order.payment_method || 'Not specified',
            stripe_session_id: order.stripe_session_id,
            profile: {
              full_name: customerName,
              email: customerEmail
            }
          };
        } catch (error) {
          console.error("Error validating order:", error, order);
          return {
            id: order.id,
            user_id: null,
            profile_id: null,
            order_number: order.order_number || 'Unknown',
            total_amount: order.total_amount || 0,
            status: 'pending',
            shipping_address: {
              address: 'Unknown',
              region: 'Unknown',
              country: 'Unknown',
              phone: 'Unknown'
            },
            billing_address: {
              address: 'Unknown',
              region: 'Unknown',
              country: 'Unknown',
              phone: 'Unknown'
            },
            items: [],
            created_at: order.created_at,
            payment_method: 'Not specified',
            stripe_session_id: null,
            profile: {
              full_name: 'Guest',
              email: 'Anonymous Order'
            }
          };
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

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      console.log("Starting order status update:", { orderId, newStatus });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session found");
        toast.error("You must be logged in to update orders");
        return;
      }

      const currentOrder = orders.find(order => order.id === orderId);
      if (!currentOrder) {
        console.error("Order not found");
        toast.error("Order not found");
        return;
      }

      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
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

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? validatedOrder : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(validatedOrder);
      }

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

  const getCustomerName = (order: OrderData) => {
    if (order.profile?.full_name && order.profile.full_name !== 'Guest') {
      return order.profile.full_name;
    }
    
    // Get name from shipping address if available
    const firstName = order.shipping_address.first_name || '';
    const lastName = order.shipping_address.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    return fullName || 'Guest';
  };

  const getCustomerEmail = (order: OrderData) => {
    return order.profile?.email || order.shipping_address.email || 'Anonymous Order';
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
                <div className="flex flex-col">
                  <span className="font-medium">{getCustomerName(order)}</span>
                  <span className="text-sm text-gray-500">{getCustomerEmail(order)}</span>
                </div>
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
                  <p>Name: {getCustomerName(selectedOrder)}</p>
                  <p>Email: {getCustomerEmail(selectedOrder)}</p>
                  <p>Phone: {selectedOrder.shipping_address.phone || 'Not provided'}</p>
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
                  <p>Phone: {selectedOrder.shipping_address.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Billing Address</h3>
                  <p>{selectedOrder.billing_address.address}</p>
                  <p>{selectedOrder.billing_address.region}</p>
                  <p>{selectedOrder.billing_address.country}</p>
                  <p>Phone: {selectedOrder.billing_address.phone || 'Not provided'}</p>
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