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
import { toast } from "sonner";

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  user_id: string;
  billing_address: any;
  shipping_address: any;
  items: any;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSessionAndFetchOrders();
  }, []);

  const checkSessionAndFetchOrders = async () => {
    try {
      console.log('Starting session check...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error("Session error occurred");
        return;
      }

      if (!session) {
        console.error('No active session');
        toast.error("Please log in to access admin panel");
        return;
      }

      console.log('Session found:', session.user.id);

      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      console.log('Role check result:', roleData, roleError);

      if (roleError) {
        console.error('Role check error:', roleError);
        toast.error("Error verifying admin status");
        return;
      }

      if (roleData?.role !== 'admin') {
        console.error('User is not an admin');
        toast.error("Unauthorized - Admin access required");
        return;
      }

      // If we get here, user is confirmed admin, fetch orders
      await fetchOrders();
    } catch (error) {
      console.error('Session check error:', error);
      toast.error("Error checking admin access");
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      setLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Orders fetched successfully:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }

      toast.success("Order status updated successfully");
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
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
        <Button onClick={() => fetchOrders()} variant="outline">
          Refresh Orders
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
              <TableHead>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_number}</TableCell>
                <TableCell>{order.profiles?.full_name || 'N/A'}</TableCell>
                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <select
                    className="border rounded p-1"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};