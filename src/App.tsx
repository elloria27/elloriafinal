
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { InstallationWizard } from "./install/components/InstallationWizard";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

function App() {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const unconfigured = !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || 
                        SUPABASE_URL === "" || SUPABASE_PUBLISHABLE_KEY === "";
    setIsSupabaseConfigured(!unconfigured);
    
    // Add installer-active class when Supabase is not configured
    if (unconfigured) {
      document.body.classList.add('installer-active');
    } else {
      document.body.classList.remove('installer-active');
    }
  }, []);

  // If Supabase is not configured, only show the Installation Wizard
  if (!isSupabaseConfigured) {
    return (
      <>
        <InstallationWizard />
        <Toaster position="top-right" expand={false} richColors />
      </>
    );
  }

  // If Supabase is configured, show the full app
  return (
    <CartProvider>
      <PagesProvider>
        <ScrollToTop />
        <PageViewTracker />
        <InstallationWizard />
        <Routes />
        <Toaster position="top-right" expand={false} richColors />
      </PagesProvider>
    </CartProvider>
  );
}

export default App;
