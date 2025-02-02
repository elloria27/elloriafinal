import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { useMediaQuery } from "@/hooks/use-mobile";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <CartProvider>
      <PagesProvider>
        <ScrollToTop />
        <Routes />
        {isMobile && <MobileNavigation />}
        <Toaster position="top-right" expand={false} richColors />
      </PagesProvider>
    </CartProvider>
  );
}

export default App;