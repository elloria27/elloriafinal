import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider, usePages } from "@/contexts/PagesContext";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import BulkOrders from "@/pages/BulkOrders";
import CustomSolutions from "@/pages/CustomSolutions";
import SustainabilityProgram from "@/pages/SustainabilityProgram";
import Admin from "@/pages/Admin";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Donation from "@/pages/Donation";
import SharedFile from "@/pages/SharedFile";

function App() {
  return (
    <PagesProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <PageViewTracker />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </CartProvider>
    </PagesProvider>
  );
}

const ProtectedRoute = ({ children, slug }: { children: React.ReactNode; slug: string }) => {
  const { publishedPages, isLoading } = usePages();
  
  if (isLoading) {
    return null;
  }

  const page = publishedPages.find(p => p.slug === slug);
  if (!page?.is_published) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function HomeRoute() {
  return <Index />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/shared/:token" element={<SharedFile />} />
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
      <Route path="/blog" element={
        <ProtectedRoute slug="blog">
          <Blog />
        </ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute slug="contact">
          <Contact />
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
      <Route path="/bulk-orders" element={
        <ProtectedRoute slug="bulk-orders">
          <BulkOrders />
        </ProtectedRoute>
      } />
      <Route path="/custom-solutions" element={
        <ProtectedRoute slug="custom-solutions">
          <CustomSolutions />
        </ProtectedRoute>
      } />
      <Route path="/sustainability-program" element={
        <ProtectedRoute slug="sustainability-program">
          <SustainabilityProgram />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute slug="admin">
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="/terms" element={
        <ProtectedRoute slug="terms">
          <Terms />
        </ProtectedRoute>
      } />
      <Route path="/donation" element={
        <ProtectedRoute slug="donation">
          <Donation />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
