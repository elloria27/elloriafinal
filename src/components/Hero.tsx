import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FloatingCartAnimation } from "@/components/animations/FloatingCartAnimation";

export const Hero = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleShopNow = () => {
    navigate("/shop");
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-secondary/5 via-white to-accent-purple/10 overflow-hidden pt-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-gray-800">Welcome to Our Store</h1>
        <p className="mt-4 text-lg text-gray-600">Discover amazing products at unbeatable prices.</p>
        <Button onClick={handleShopNow} className="mt-6">
          Shop Now
        </Button>
      </motion.div>
      <FloatingCartAnimation />
    </section>
  );
};
