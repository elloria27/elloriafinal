import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { Routes } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <PageViewTracker />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <Routes />
          <Footer />
        </div>
        <Toaster position="top-right" expand={true} richColors />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;