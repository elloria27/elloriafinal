import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export const Activity = () => {
  const [orders, setOrders] = useState<Tables<'orders'>[]>([]);
  const [reviews, setReviews] = useState<Tables<'reviews'>[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderData) {
        setOrders(orderData);
      }

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (reviewData) {
        setReviews(reviewData);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Activity</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Orders</h3>
        {orders.map(order => (
          <div key={order.id} className="p-4 border rounded">
            <p>Order #{order.order_number}</p>
            <p>Total: ${order.total_amount}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Reviews</h3>
        {reviews.map(review => (
          <div key={review.id} className="p-4 border rounded">
            <p>Rating: {review.rating}/5</p>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};