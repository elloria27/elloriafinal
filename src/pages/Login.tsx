import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("Session found, checking user role");
        try {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (roleError) {
            console.error("Error fetching role:", roleError);
            return;
          }

          if (!roleData) {
            console.log("No role found for user");
            return;
          }

          console.log("User role:", roleData.role);
          const redirectPath = roleData.role === 'admin' ? '/admin' : (redirectTo || '/profile');
          
          toast.success("Welcome back!", {
            description: "You've been successfully logged in"
          });
          
          navigate(redirectPath);
        } catch (error) {
          console.error("Error in role check:", error);
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
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      if (!session) {
        console.error("No session after successful login");
        throw new Error("Login successful but no session created");
      }

      console.log("Login successful, checking user role");
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (roleError) {
        console.error("Error fetching role:", roleError);
        throw roleError;
      }

      if (!roleData) {
        console.log("No role found for user");
        toast.error("Account setup incomplete", {
          description: "Please contact support to complete your account setup"
        });
        return;
      }

      console.log("User role:", roleData.role);
      const redirectPath = roleData.role === 'admin' ? '/admin' : (redirectTo || '/profile');
      
      toast.success("Welcome back!", {
        description: "You've been successfully logged in"
      });
      
      navigate(redirectPath);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Login error:", authError);
      
      let errorMessage = "Failed to sign in";
      let description = "Please check your credentials and try again";
      
      if (authError.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid credentials";
        description = "The email or password you entered is incorrect";
      } else if (authError.message.includes("Email not confirmed")) {
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