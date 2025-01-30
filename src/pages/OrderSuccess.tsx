import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    // Clear the cart on successful order
    clearCart();

    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Get guest email from localStorage if available
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      const orderDetails = JSON.parse(lastOrder);
      setGuestEmail(orderDetails.customerDetails?.email || "");
    }
  }, [clearCart]);

  const handleAuthRedirect = () => {
    // Store email in localStorage for auto-fill
    if (guestEmail) {
      localStorage.setItem('loginEmail', guestEmail);
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center space-y-6 bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Thank you for your order!
          </h1>
          <p className="text-gray-600">
            Your order has been successfully placed. We'll send you an email with your order details shortly.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Button onClick={() => navigate("/shop")}>
              Continue Shopping
            </Button>
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => navigate("/profile")}>
                View Orders
              </Button>
            ) : (
              <Button variant="outline" onClick={handleAuthRedirect}>
                Sign In to Track Orders
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;