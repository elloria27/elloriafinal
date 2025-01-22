import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
        <Toaster />
      </Router>
    </CartProvider>
  );
}

export default App;