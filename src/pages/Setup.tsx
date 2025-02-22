
import { SEOHead } from "@/components/SEOHead";
import { InstallationWizard } from "@/install/components/InstallationWizard";

export default function Setup() {
  console.log("Setup page rendered");
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
