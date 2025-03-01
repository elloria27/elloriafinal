
import { supabase } from "@/integrations/supabase/client";

export async function checkInstallationStatus(): Promise<boolean> {
  try {
    // First check if we can connect to Supabase
    const { data: tablesData, error: tablesError } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1);

    if (tablesError) {
      console.log("Supabase connection error:", tablesError);
      return false;
    }

    // Then check if there are any admin users
    const { data: adminData, error: adminError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("role", "admin")
      .limit(1);

    if (adminError) {
      console.log("Admin check error:", adminError);
      return false;
    }

    // If both checks pass and there's at least one admin, installation is complete
    return tablesData?.length > 0 && adminData?.length > 0;
  } catch (error) {
    console.error("Installation check error:", error);
    return false;
  }
}
