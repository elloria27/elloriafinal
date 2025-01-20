import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

interface OrderDetails {
  items: any[];
  subtotal: number;
  taxes: { gst: number; pst: number; hst: number; };
  shipping: { name: string; price: number; };
  total: number;
  currency: string;
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    }
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container max-w-4xl mx-auto px-4 py-8 mt-32">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">No order found</h1>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container max-w-4xl mx-auto px-4 py-8 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Thank You for Your Order!</h1>
            <p className="text-gray-600">
              Your order has been successfully placed. We'll send you an email confirmation shortly.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold mb-6">Order Details</h2>
            
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-primary">
                      {orderDetails.currency} {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{orderDetails.currency} {orderDetails.subtotal.toFixed(2)}</span>
              </div>

              {orderDetails.taxes.gst > 0 && (
                <div className="flex justify-between text-sm">
                  <span>GST ({orderDetails.taxes.gst}%)</span>
                  <span>
                    {orderDetails.currency} {(orderDetails.subtotal * orderDetails.taxes.gst / 100).toFixed(2)}
                  </span>
                </div>
              )}

              {orderDetails.taxes.pst > 0 && (
                <div className="flex justify-between text-sm">
                  <span>PST ({orderDetails.taxes.pst}%)</span>
                  <span>
                    {orderDetails.currency} {(orderDetails.subtotal * orderDetails.taxes.pst / 100).toFixed(2)}
                  </span>
                </div>
              )}

              {orderDetails.taxes.hst > 0 && (
                <div className="flex justify-between text-sm">
                  <span>HST ({orderDetails.taxes.hst}%)</span>
                  <span>
                    {orderDetails.currency} {(orderDetails.subtotal * orderDetails.taxes.hst / 100).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Shipping ({orderDetails.shipping.name})</span>
                <span>{orderDetails.currency} {orderDetails.shipping.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>{orderDetails.currency} {orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;