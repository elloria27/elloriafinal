import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

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
            <Button variant="outline" onClick={() => navigate("/profile")}>
              View Orders
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;