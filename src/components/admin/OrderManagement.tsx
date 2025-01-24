import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Order } from "@/types/order";

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles!inner (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Fetched orders:', ordersData);

      // Validate and transform the orders data
      const validatedOrders = ordersData.map(order => {
        try {
          const validatedOrder: Order = {
            id: order.id,
            user_id: order.user_id,
            profile_id: order.profile_id,
            order_number: order.order_number,
            total_amount: order.total_amount,
            status: order.status,
            shipping_address: validateShippingAddress(order.shipping_address),
            billing_address: validateShippingAddress(order.billing_address),
            items: validateOrderItems(order.items),
            created_at: order.created_at,
            profile: order.profiles
          };
          return validatedOrder;
        } catch (error) {
          console.error('Error validating order:', error);
          return null;
        }
      }).filter(Boolean) as Order[];

      setOrders(validatedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to fetch orders");
    }
  };

  const validateShippingAddress = (address: any) => {
    if (!address || typeof address !== 'object') {
      throw new Error('Invalid shipping address');
    }

    return {
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || ''
    };
  };

  const validateOrderItems = (items: any) => {
    if (!Array.isArray(items)) {
      throw new Error('Invalid order items');
    }

    return items.map(item => ({
      name: item.name || '',
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0
    }));
  };

  const viewOrderDetails = (order: Order) => {
    console.log('Viewing order details:', order);
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button onClick={fetchOrders}>Refresh Orders</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.order_number}</TableCell>
              <TableCell>{order.profile?.full_name || 'N/A'}</TableCell>
              <TableCell>{order.profile?.email || 'N/A'}</TableCell>
              <TableCell>${order.total_amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => viewOrderDetails(order)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <p>Order Number: {selectedOrder.order_number}</p>
                  <p>Customer: {selectedOrder.profile?.full_name}</p>
                  <p>Email: {selectedOrder.profile?.email}</p>
                  <p>Total Amount: ${selectedOrder.total_amount}</p>
                  <p>Status: {selectedOrder.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p>{selectedOrder.shipping_address.street}</p>
                  <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}</p>
                  <p>{selectedOrder.shipping_address.country}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
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
                        <TableCell>${item.price}</TableCell>
                        <TableCell>${item.quantity * item.price}</TableCell>
                      </TableRow>
                    ))}
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