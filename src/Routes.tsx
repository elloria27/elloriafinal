import { Route, Routes as RouterRoutes } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Shop } from "@/pages/Shop";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { ProductDetail } from "@/pages/ProductDetail";
import { Checkout } from "@/pages/Checkout";
import { OrderSuccess } from "@/pages/OrderSuccess";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Profile } from "@/pages/Profile";
import { Admin } from "@/pages/Admin";

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/*" element={<Profile />} />
      <Route path="/admin/*" element={<Admin />} />
    </RouterRoutes>
  );
};