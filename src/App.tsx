import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { Routes } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  const isSetupRoute = window.location.pathname === '/setup';

  // If we're on the setup route, or Supabase is initialized, render the full app
  // Otherwise, redirect to setup
  if (!supabase && !isSetupRoute) {
    window.location.href = '/setup';
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          {!isSetupRoute ? (
            <PagesProvider>
              <CartProvider>
                <ScrollToTop />
                <PageViewTracker />
                <Header />
                <Routes />
                <Footer />
              </CartProvider>
            </PagesProvider>
          ) : (
            <Routes />
          )}
          <Toaster />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
