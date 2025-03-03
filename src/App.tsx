
import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { useEffect, useState } from "react";
import { isInstallationNeeded } from "@/utils/migration";

function App() {
  console.log('App rendering');
  const [needsInstall, setNeedsInstall] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we need to show the installation wizard
    const checkInstallation = async () => {
      try {
        const installNeeded = await isInstallationNeeded();
        setNeedsInstall(installNeeded);
      } catch (error) {
        console.error("Error checking installation status:", error);
        // If there's an error, we'll assume we need installation
        setNeedsInstall(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkInstallation();
  }, []);

  // If we're still checking installation status, show minimal loading UI
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // For the installation flow, we don't need the full app context providers
  if (needsInstall) {
    return (
      <>
        <Routes />
        <Toaster position="top-right" expand={false} richColors />
      </>
    );
  }

  // Normal app with all providers
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

export default App;
