
import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ForBusiness from "@/pages/ForBusiness";
import CustomSolutions from "@/pages/CustomSolutions";
import Sustainability from "@/pages/Sustainability";
import SustainabilityProgram from "@/pages/SustainabilityProgram";
import Donation from "@/pages/Donation";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Terms from "@/pages/Terms";
import Thanks from "@/pages/Thanks";
import Admin from "@/pages/Admin";
import SharedFile from "@/pages/SharedFile";
import BulkOrders from "@/pages/BulkOrders";
import NotFound from "@/pages/NotFound";
import DynamicPage from "@/pages/DynamicPage";
import Certificates from "@/pages/Certificates";
import SetupWizard from "@/pages/SetupWizard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

export function Routes() {
  const [isInitialSetup, setIsInitialSetup] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        // Check if site_settings table exists and has any records
        const { count, error } = await supabase
          .from('site_settings')
          .select('*', { count: 'exact', head: true });
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking site settings:", error);
          setIsInitialSetup(true);
        } else {
          // If count is 0 or null, it means no settings exist, so show setup wizard
          setIsInitialSetup(count === 0 || count === null);
        }
      } catch (err) {
        console.error("Error in checkInitialSetup:", err);
        // If there's an error, assume it's the initial setup
        setIsInitialSetup(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialSetup();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to setup if initial setup is needed
  if (isInitialSetup && window.location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }

  return (
    <>
      {window.location.pathname !== '/setup' && <Header />}
      <RouterRoutes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/for-business" element={<ForBusiness />} />
        <Route path="/custom-solutions" element={<CustomSolutions />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/sustainability-program" element={<SustainabilityProgram />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/shared/:token" element={<SharedFile />} />
        <Route path="/shared/bulk/:token" element={<SharedFile />} />
        <Route path="/bulk-orders" element={<BulkOrders />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/setup" element={<SetupWizard />} />
        {/* Add dynamic page route before the 404 route */}
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      {window.location.pathname !== '/setup' && <Footer />}
    </>
  );
}
