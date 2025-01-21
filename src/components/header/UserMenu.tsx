import { User } from "lucide-react";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const navigate = useNavigate();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-gray-600 hover:text-primary transition-colors"
          onClick={() => navigate("/login")}
        >
          <User className="h-5 w-5" />
        </motion.button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-6 bg-white shadow-lg border border-gray-100">
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Welcome to Elloria</h4>
          <p className="text-sm text-gray-500">
            Sign in to access your account or create one to enjoy exclusive benefits and faster checkout.
          </p>
          <div className="flex gap-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white" 
              variant="default"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900" 
              variant="outline"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};