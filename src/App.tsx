import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider, usePages } from "@/contexts/PagesContext";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Sustainability from "@/pages/Sustainability";
import ForBusiness from "@/pages/ForBusiness";
import Admin from "@/pages/Admin";

import "./App.css";

const ProtectedRoute = ({ children, slug }: { children: React.ReactNode; slug: string }) => {
  const { publishedPages, isLoading } = usePages();
  
  if (isLoading) {
    return null; // Or a loading component
  }

  const page = publishedPages.find(p => p.slug === slug);
  if (!page?.is_published) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={
        <ProtectedRoute slug="shop">
          <Shop />
        </ProtectedRoute>
      } />
      <Route path="/about" element={
        <ProtectedRoute slug="about">
          <About />
        </ProtectedRoute>
      } />
      <Route path="/login" element={
        <ProtectedRoute slug="login">
          <Login />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute slug="register">
          <Register />
        </ProtectedRoute>
      } />
      <Route path="/profile/*" element={
        <ProtectedRoute slug="profile">
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/product/:id" element={
        <ProtectedRoute slug="product">
          <ProductDetail />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute slug="checkout">
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/order-success" element={
        <ProtectedRoute slug="order-success">
          <OrderSuccess />
        </ProtectedRoute>
      } />
      <Route path="/sustainability" element={
        <ProtectedRoute slug="sustainability">
          <Sustainability />
        </ProtectedRoute>
      } />
      <Route path="/for-business" element={
        <ProtectedRoute slug="for-business">
          <ForBusiness />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute slug="admin">
          <Admin />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <PagesProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Header />
          <AppRoutes />
          <Footer />
          <Toaster />
        </Router>
      </CartProvider>
    </PagesProvider>
  );
}

export default App;