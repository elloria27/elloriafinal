import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Shop from "@/pages/Shop";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { Dashboard } from "@/pages/admin/Dashboard";
import Media from "@/pages/admin/Media";
import Pages from "@/pages/admin/Pages";
import Blog from "@/pages/admin/Blog";
import Store from "@/pages/admin/Store";
import Users from "@/pages/admin/Users";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./App.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="media" element={<Media />} />
            <Route path="pages" element={<Pages />} />
            <Route path="blog" element={<Blog />} />
            <Route path="store" element={<Store />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
        <Toaster />
      </CartProvider>
    </Router>
  );
}

export default App;