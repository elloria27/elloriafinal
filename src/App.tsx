
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { InstallationWizard } from "./install/components/InstallationWizard";

function App() {
  console.log('App rendering');
  return (
    <CartProvider>
      <PagesProvider>
        <ScrollToTop />
        <PageViewTracker />
        <InstallationWizard />
        <Routes />
        <Toaster position="top-right" expand={false} richColors />
      </PagesProvider>
    </CartProvider>
  );
}

export default App;
