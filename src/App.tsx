
import { useEffect } from 'react';
import { migrateDatabase } from './integrations/supabase/migration';
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export default function App() {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const { success, errors } = await migrateDatabase();
        if (!success) {
          console.error('Database migration errors:', errors);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDatabase();
  }, []);

  console.log('App rendering');
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
