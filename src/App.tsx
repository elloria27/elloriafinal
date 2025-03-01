
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import Install from "@/pages/Install";
import { supabase } from "@/integrations/supabase/client";

function App() {
  console.log('App rendering');
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInstallation = async () => {
      try {
        // Set a short timeout for the Supabase query to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Connection timeout")), 5000);
        });

        // Try to query a basic table to check connection
        const queryPromise = supabase.from('site_settings').select('id').limit(1);
        
        // Race between the timeout and the query
        const { data, error } = await Promise.race([
          queryPromise,
          timeoutPromise.then(() => ({ data: null, error: new Error("Connection timeout") }))
        ]) as any;
        
        if (!error && data && data.length > 0) {
          console.log("System is installed");
          setIsInstalled(true);
        } else {
          console.log("System needs installation:", error);
          setIsInstalled(false);
        }
      } catch (err) {
        console.error("Error checking installation:", err);
        setIsInstalled(false);
      }
    };

    checkInstallation();
  }, []);

  if (isInstalled === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  if (isInstalled === false) {
    return (
      <BrowserRouter>
        <RouterRoutes>
          <Route path="*" element={<Install />} />
        </RouterRoutes>
        <Toaster position="top-right" expand={false} richColors />
      </BrowserRouter>
    );
  }

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
