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
import { RefreshCw } from "lucide-react";

const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getPaymentStatusBadge = (order: OrderData) => {
  const method = order.payment_method || 'Not specified';
  const variant = order.stripe_session_id ? 'default' : 'secondary';
  return <Badge variant={variant}>{method}</Badge>;
};

const validateShippingAddress = (address: unknown): ShippingAddress => {
  if (typeof address !== 'object' || !address) {
    console.error('Invalid shipping address format:', address);
    return {
      address: '',
      region: '',
      country: '',
      phone: '',
      first_name: '',
      last_name: '',
      email: ''
    };
  }
  
  const typedAddress = address as Record<string, unknown>;
  
  console.log('Validating shipping address:', typedAddress);
  
  return {
    address: String(typedAddress.address || ''),
    region: String(typedAddress.region || ''),
    country: String(typedAddress.country || ''),
    phone: String(typedAddress.phone || ''),
    first_name: String(typedAddress.first_name || ''),
    last_name: String(typedAddress.last_name || ''),
    email: String(typedAddress.email || '')
  };
};

const validateOrderItems = (items: unknown): OrderItem[] => {
  if (!Array.isArray(items)) {
    console.error('Items must be an array:', items);
    return [];
  }

  return items.map((item, index) => {
    if (typeof item !== 'object' || !item) {
      console.error(`Invalid order item at index ${index}:`, item);
      return {
        id: '',
        name: 'Unknown Product',
        quantity: 0,
        price: 0
      };
    }

    const typedItem = item as Record<string, unknown>;
    return {
      id: String(typedItem.id || ''),
      name: String(typedItem.name || 'Unknown Product'),
      quantity: Number(typedItem.quantity || 0),
      price: Number(typedItem.price || 0),
      image: typedItem.image ? String(typedItem.image) : undefined,
    };
  });
};

export const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isMobile = useIsMobile();

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast.error('Failed to update order status');
        return;
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error in handleStatusUpdate:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      setRefreshing(true);
      
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:profiles!left (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
        return;
      }

      console.log("Raw orders data:", ordersData);

      const validatedOrders: OrderData[] = [];

      for (const order of ordersData || []) {
        try {
          console.log('Processing order:', order);
          
          const shippingAddress = validateShippingAddress(order.shipping_address);
          const billingAddress = validateShippingAddress(order.billing_address);
          const items = validateOrderItems(order.items);

          // Get customer name from shipping address if not a registered user
          const customerName = order.profiles?.full_name || 
            `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim() || 
            'Guest';
          
          // Get customer email from shipping address if not a registered user
          const customerEmail = order.profiles?.email || 
            shippingAddress.email || 
            'N/A';

          const validatedOrder: OrderData = {
            id: order.id,
            user_id: order.user_id,
            profile_id: order.profile_id,
            order_number: order.order_number,
            total_amount: Number(order.total_amount) || 0,
            status: order.status as OrderStatus,
            shipping_address: shippingAddress,
            billing_address: billingAddress,
            items: items,
            created_at: order.created_at,
            payment_method: order.payment_method || 'Not specified',
            stripe_session_id: order.stripe_session_id,
            profile: {
              full_name: customerName,
              email: customerEmail
            }
          };

          console.log('Validated order:', validatedOrder);
          validatedOrders.push(validatedOrder);
        } catch (error) {
          console.error("Error processing order:", error, order);
        }
      }

      console.log("Validated orders:", validatedOrders);
      setOrders(validatedOrders);
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      toast.error("An unexpected error occurred while fetching orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button 
          onClick={fetchOrders} 
          variant="outline"
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
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
      )}

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
