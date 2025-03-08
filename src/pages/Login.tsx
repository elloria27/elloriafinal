
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check for stored email from order completion
    const storedEmail = localStorage.getItem('loginEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      localStorage.removeItem('loginEmail'); // Clear after use
    }
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const response = await fetch('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            console.log('Session expired or invalid');
            localStorage.removeItem('authToken');
            return;
          }
          
          const data = await response.json();
          console.log("User data:", data.user);
          
          if (data.user) {
            console.log("User role:", data.user.role);
            const redirectPath = data.user.role === 'admin' ? '/admin' : (redirectTo || '/profile');
            
            toast.success("Welcome back!", {
              description: "You've been successfully logged in"
            });
            
            navigate(redirectPath);
          }
        } catch (error) {
          console.error("Error in session check:", error);
          localStorage.removeItem('authToken');
        }
      }
    };
    
    checkSession();
  }, [navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the token
      localStorage.setItem('authToken', data.token);
      
      console.log("Login successful, user role:", data.user.role);
      const redirectPath = data.user.role === 'admin' ? '/admin' : (redirectTo || '/profile');
      
      toast.success("Welcome back!", {
        description: "You've been successfully logged in"
      });
      
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Failed to sign in";
      let description = "Please check your credentials and try again";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid credentials";
        description = "The email or password you entered is incorrect";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email not verified";
        description = "Please check your email to verify your account";
      }
      
      toast.error(errorMessage, {
        description: description
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center gap-2"
            disabled={isLoading}
          >
            <LogIn className="h-5 w-5" />
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
