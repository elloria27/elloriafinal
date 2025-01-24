import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  address: string;
  region: string;
  country: string;
  phone: string;
}

interface OrderData {
  id: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string | null;
  user_id: string;
  profile_id: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  profile: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders data...');
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profile:profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Type assertion and validation for the raw data
      const typedOrders = (ordersData || []).map(order => {
        // Ensure shipping_address and items are properly typed
        const shippingAddress = order.shipping_address as unknown as ShippingAddress;
        const items = order.items as unknown as OrderItem[];
        
        // Validate status is one of the allowed values
        const status = order.status as OrderStatus;
        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
          console.error(`Invalid status value: ${status}`);
          throw new Error(`Invalid status value: ${status}`);
        }

        return {
          ...order,
          shipping_address: shippingAddress,
          items: items,
          status: status
        } as OrderData;
      });

      console.log('Orders data fetched:', typedOrders);
      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
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

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Fetch the updated order to ensure we have the latest data
      const { data: updatedOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          profile:profiles (
            full_name,
            email
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Update local state with the fetched order data
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...updatedOrder,
                shipping_address: updatedOrder.shipping_address as unknown as ShippingAddress,
                items: updatedOrder.items as unknown as OrderItem[],
                status: updatedOrder.status as OrderStatus
              }
            : order
        )
      );

      // Send email notification
      const emailResponse = await supabase.functions.invoke('send-order-status-email', {
        body: {
          customerEmail: updatedOrder.profile?.email,
          customerName: updatedOrder.profile?.full_name || 'Valued Customer',
          orderId: updatedOrder.id,
          orderNumber: updatedOrder.order_number,
          newStatus: newStatus
        }
      });

      if (emailResponse.error) {
        console.error('Error sending status update email:', emailResponse.error);
        toast.error("Order updated but failed to send notification email");
      } else {
        toast.success("Order status updated and notification sent");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders found
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Details</TableHead>
              <TableHead>Customer Info</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{order.order_number}</div>
                    <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{order.profile?.full_name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.profile?.email || 'N/A'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{order.shipping_address.address}</div>
                    <div>{order.shipping_address.region}, {order.shipping_address.country}</div>
                    <div className="text-sm text-gray-500">Phone: {order.shipping_address.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <select
                      className="w-full border rounded p-1"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p>Name: {selectedOrder.profile?.full_name || 'N/A'}</p>
                  <p>Email: {selectedOrder.profile?.email || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p>{selectedOrder.shipping_address.address}</p>
                  <p>{selectedOrder.shipping_address.region}, {selectedOrder.shipping_address.country}</p>
                  <p>Phone: {selectedOrder.shipping_address.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
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
                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">Total:</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(selectedOrder.total_amount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
