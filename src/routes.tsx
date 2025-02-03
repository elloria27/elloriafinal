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
import { InventoryManagement } from "@/components/admin/shop/InventoryManagement";

export function Routes() {
  return (
    <>
      <RouterRoutes>
        <Route path="/" element={<><Header /><Index /><Footer /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />
        <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
        <Route path="/shop" element={<><Header /><Shop /><Footer /></>} />
        <Route path="/products/:slug" element={<><Header /><ProductDetail /><Footer /></>} />
        <Route path="/blog" element={<><Header /><Blog /><Footer /></>} />
        <Route path="/blog/:id" element={<><Header /><BlogPost /><Footer /></>} />
        <Route path="/for-business" element={<><Header /><ForBusiness /><Footer /></>} />
        <Route path="/custom-solutions" element={<><Header /><CustomSolutions /><Footer /></>} />
        <Route path="/sustainability" element={<><Header /><Sustainability /><Footer /></>} />
        <Route path="/sustainability-program" element={<><Header /><SustainabilityProgram /><Footer /></>} />
        <Route path="/donation" element={<><Header /><Donation /><Footer /></>} />
        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        <Route path="/register" element={<><Header /><Register /><Footer /></>} />
        <Route path="/profile/*" element={<><Header /><Profile /><Footer /></>} />
        <Route path="/checkout" element={<><Header /><Checkout /><Footer /></>} />
        <Route path="/order-success" element={<><Header /><OrderSuccess /><Footer /></>} />
        <Route path="/terms" element={<><Header /><Terms /><Footer /></>} />
        <Route path="/thanks" element={<><Header /><Thanks /><Footer /></>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/inventory" element={<InventoryManagement />} />
        <Route path="/shared/:token" element={<><Header /><SharedFile /><Footer /></>} />
        <Route path="/shared/bulk/:token" element={<><Header /><SharedFile /><Footer /></>} />
        <Route path="/bulk-orders" element={<><Header /><BulkOrders /><Footer /></>} />
        <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
      </RouterRoutes>
    </>
  );
}