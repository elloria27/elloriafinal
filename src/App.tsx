
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function App() {
  console.log('App rendering');
  const navigate = useNavigate();

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      // Try to connect to Supabase and check if site_settings table exists
      const { error } = await supabase.from('site_settings').select('*', { count: 'exact', head: true });
      
      if (error) {
        // If there's an error (table doesn't exist), redirect to setup
        console.log('Setup required, redirecting to /setup');
        navigate('/setup');
      }
    } catch (error) {
      console.log('Setup check failed:', error);
      navigate('/setup');
    }
  };

  return (
    <CartProvider>
      <PagesProvider>
        <ScrollToTop />
        <PageViewTracker />
        <Routes />
        <Toaster position="top-right" expand={false} richColors />
      </PagesProvider>
    </CartProvider>
  );
}

export default App;
