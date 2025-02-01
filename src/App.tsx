import { BrowserRouter } from "react-router-dom";
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
        <BrowserRouter>
          <PagesProvider>
            <ScrollToTop />
            <Routes />
            <Toaster position="top-right" expand={false} richColors />
          </PagesProvider>
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;