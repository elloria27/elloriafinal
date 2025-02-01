import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "./routes";

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes />
          <Toaster position="top-right" expand={false} richColors />
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;