import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingCartAnimationProps {
  productImage: string;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}

export const FloatingCartAnimation = ({ 
  productImage, 
  startPosition, 
  onComplete 
}: FloatingCartAnimationProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ 
            opacity: 1,
            scale: 1,
            x: startPosition.x,
            y: startPosition.y,
          }}
          animate={{
            opacity: 0,
            scale: 0.5,
            x: window.innerWidth - 60,
            y: 20,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="fixed z-50 pointer-events-none"
        >
          <img
            src={productImage}
            alt="Added to cart"
            className="w-16 h-16 object-contain rounded-lg shadow-lg bg-white"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};