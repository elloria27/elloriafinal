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
    console.error("Invalid address format:", address);
    throw new Error('Invalid shipping address format');
  }
  
  const typedAddress = address as Record<string, unknown>;
  
  if (
    typeof typedAddress.address !== 'string' ||
    typeof typedAddress.region !== 'string' ||
    typeof typedAddress.country !== 'string' ||
    typeof typedAddress.phone !== 'string'
  ) {
    console.error("Missing required fields:", typedAddress);
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
  console.log("Validating order items:", items);
  
  if (!Array.isArray(items)) {
    console.error("Items must be an array:", items);
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
      console.error("Invalid order item:", item);
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

const validateOrderStatus = (status: unknown): OrderStatus => {
  console.log("Validating order status:", status);
  
  if (typeof status !== 'string' || !ORDER_STATUSES.includes(status as OrderStatus)) {
    console.error("Invalid order status:", status);
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

      if (!Array.isArray(ordersData)) {
        console.error("Orders data is not an array:", ordersData);
        toast.error("Invalid orders data format");
        return;
      }

      const validatedOrders: OrderData[] = ordersData.map(order => {
        try {
          console.log("Processing order:", order);
          
          const shippingAddress = validateShippingAddress(order.shipping_address);
          const billingAddress = validateShippingAddress(order.billing_address);
          const status = validateOrderStatus(order.status);
          const items = validateOrderItems(order.items);
          
          const validatedOrder: OrderData = {
            id: order.id,
            user_id: order.user_id,
            profile_id: order.profile_id,
            order_number: order.order_number,
            total_amount: order.total_amount,
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

          console.log("Validated order:", validatedOrder);
          return validatedOrder;
        } catch (error) {
          console.error("Error validating order:", error, order);
          throw error;
        }
      });

      console.log("Setting validated orders:", validatedOrders);
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
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status");
        return;
      }

      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error("An unexpected error occurred while updating order status");
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.order_number}</TableCell>
              <TableCell>{order.profile.full_name}</TableCell>
              <TableCell>
                <Badge>{order.status}</Badge>
              </TableCell>
              <TableCell>${order.total_amount}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
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
        {selectedOrder && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.order_number}</DialogTitle>
              <DialogDescription>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Customer Information</h3>
                    <p>Name: {selectedOrder.profile.full_name}</p>
                    <p>Email: {selectedOrder.profile.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Order Status</h3>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as OrderStatus)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="font-semibold">Items</h3>
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between py-2">
                        <span>{item.name}</span>
                        <span>
                          {item.quantity} x ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Amount</h3>
                    <p>${selectedOrder.total_amount}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Shipping Address</h3>
                    <p>{selectedOrder.shipping_address.address}</p>
                    <p>
                      {selectedOrder.shipping_address.region}, {selectedOrder.shipping_address.country}
                    </p>
                    <p>Phone: {selectedOrder.shipping_address.phone}</p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};