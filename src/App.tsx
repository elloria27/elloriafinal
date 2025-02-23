
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

function App() {
  console.log('App rendering');
  return (
    <AuthProvider>
      <CartProvider>
        <PagesProvider>
          <ScrollToTop />
          <PageViewTracker />
          <Routes />
          <Toaster position="top-right" expand={false} richColors />
        </PagesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
