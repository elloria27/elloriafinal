import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Invoices from "@/pages/profile/Invoices";
import Activity from "@/pages/profile/Activity";
import Settings from "@/pages/profile/Settings";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import ProductDetail from "@/pages/ProductDetail";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/invoices" element={<Invoices />} />
          <Route path="/profile/activity" element={<Activity />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-center" />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;