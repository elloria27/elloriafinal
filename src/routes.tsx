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
import InstallWizard from "@/pages/InstallWizard";
import { isInstallationNeeded } from "@/utils/migration";
import { useEffect, useState } from "react";

export function Routes() {
  const [needsInstall, setNeedsInstall] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if installation is needed
    const checkInstallation = async () => {
      const installNeeded = await isInstallationNeeded();
      setNeedsInstall(installNeeded);
      setLoading(false);
    };

    checkInstallation();
  }, []);

  // Show loading state while checking if install is needed
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If installation is needed, only render the install wizard
  if (needsInstall) {
    return <InstallWizard />;
  }

  // Otherwise, render the normal app routes
  return (
    <>
      <Header />
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
        <Route path="/install" element={<InstallWizard />} />
        {/* Add dynamic page route before the 404 route */}
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      <Footer />
    </>
  );
}
