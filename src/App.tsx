
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Location } from 'react-router-dom';

interface AppProps {
  location: Location;
}

function App({ location }: AppProps) {
  const isSetupRoute = location.pathname === '/setup';
  
  // Only render providers if Supabase is configured or we're on the setup route
  if (!isSupabaseConfigured && !isSetupRoute) {
    window.location.href = '/setup';
    return null;
  }

  return (
    <CartProvider>
      <PagesProvider>
        <ScrollToTop />
        {isSupabaseConfigured && <PageViewTracker />}
        <Routes />
        <Toaster position="top-right" expand={false} richColors />
      </PagesProvider>
    </CartProvider>
  );
}

export default App;
