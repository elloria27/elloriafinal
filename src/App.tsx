
import { useEffect, useState } from "react";
import { Routes } from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ScrollToTop } from "@/components/ScrollToTop";
import { checkInstallationStatus } from "@/utils/installationCheck";
import { useNavigate, useLocation } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingInstallation, setIsCheckingInstallation] = useState(true);

  useEffect(() => {
    const checkInstallation = async () => {
      // Only check if we're not already on the install page
      if (location.pathname !== "/install") {
        const isInstalled = await checkInstallationStatus();
        
        if (!isInstalled) {
          navigate("/install");
        }
      }
      
      setIsCheckingInstallation(false);
    };

    checkInstallation();
  }, [navigate, location.pathname]);

  if (isCheckingInstallation && location.pathname !== "/install") {
    // You could add a loading state here if needed
    return null;
  }

  return (
    <>
      <SonnerToaster position="top-right" />
      <Toaster />
      <ScrollToTop />
      <Routes />
    </>
  );
}

export default App;
