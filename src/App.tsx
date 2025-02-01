import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PagesProvider } from "@/contexts/PagesContext";
import { Routes } from "./routes";

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <PagesProvider>
          <ScrollToTop />
          <Routes />
          <Toaster position="top-right" expand={false} richColors />
        </PagesProvider>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;