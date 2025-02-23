import { User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-mobile";

interface UserMenuProps {
  onClose?: () => void;
}

export const UserMenu = ({ onClose }: UserMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      if (onClose) {
        onClose();
      }
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const handleClick = () => {
    if (isMobile) {
      if (user) {
        navigate("/profile");
        if (onClose) {
          onClose();
        }
      } else {
        navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
        if (onClose) {
          onClose();
        }
      }
      return;
    }
  };

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={handleClick}
          >
            <User className="h-5 w-5" />
          </motion.button>
        </HoverCardTrigger>
        {!isMobile && (
          <HoverCardContent className="w-80 p-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Welcome back!</h4>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
              <div className="flex gap-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    navigate("/profile");
                    if (onClose) onClose();
                  }}
                >
                  Profile
                </Button>
                <Button 
                  className="w-full flex items-center gap-2" 
                  variant="destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-gray-600 hover:text-primary transition-colors"
          onClick={handleClick}
        >
          <User className="h-5 w-5" />
        </motion.button>
      </HoverCardTrigger>
      {!isMobile && (
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
                onClick={() => {
                  navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
                  if (onClose) onClose();
                }}
              >
                Sign In
              </Button>
              <Button 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900" 
                variant="outline"
                onClick={() => {
                  navigate("/register");
                  if (onClose) onClose();
                }}
              >
                Register
              </Button>
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};