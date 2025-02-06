import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  console.log('App rendering');
  return (
    <CartProvider>
      <PagesProvider>
        <ScrollToTop />
        <Outlet />
        <Toaster position="top-right" expand={false} richColors />
      </PagesProvider>
    </CartProvider>
  );
}

export default App;