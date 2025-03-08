
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const LoginPrompt = () => {
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Fetch user data using the token
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            // Token invalid or expired
            localStorage.removeItem('authToken');
            return;
          }
          
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            
            // Fetch profile data
            const profileResponse = await fetch('/api/profiles/' + data.user.id, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).catch(() => null);
            
            if (profileResponse && profileResponse.ok) {
              const profileData = await profileResponse.json();
              setProfile(profileData);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, []);

  // If user is authenticated, show welcome message
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-accent-purple/30 rounded-lg p-6 mb-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">
              Welcome back, {profile?.full_name || user.email}
            </h3>
            <p className="text-sm text-gray-600">
              Complete your purchase securely
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // If user chose to continue as guest
  if (isGuest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-accent-purple/30 rounded-lg p-6 mb-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Checking out as a guest</h3>
            <p className="text-sm text-gray-600">You can create an account after checkout</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default state - unauthenticated user
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-accent-purple/30 rounded-lg p-6 mb-8 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Sign in for a faster checkout</h3>
            <p className="text-sm text-gray-600">Access your saved addresses and payment methods</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="default" 
            className="gap-2" 
            onClick={() => navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`)}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
          <Button variant="outline" onClick={() => setIsGuest(true)}>
            Continue as Guest
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
