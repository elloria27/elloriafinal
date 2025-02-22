
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { InstallationWizard } from "@/install/components/InstallationWizard";
import { isSupabaseConfigured } from "@/utils/supabase-helpers";

export default function Setup() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isSupabaseConfigured()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <SEOHead
        title="Setup Wizard - Installation"
        description="Set up your application with the installation wizard"
      />
      <div className="min-h-screen flex items-center justify-center">
        <InstallationWizard />
      </div>
    </>
  );
}
