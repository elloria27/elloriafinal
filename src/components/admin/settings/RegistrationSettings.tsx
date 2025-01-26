import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const RegistrationSettings = ({ settings }: { settings: any }) => {
  const [enableRegistration, setEnableRegistration] = useState(
    settings?.enable_registration || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          enable_registration: enableRegistration,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("Registration settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (error) {
      console.error("Error updating registration settings:", error);
      toast.error("Failed to update registration settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Registration Settings</h3>
        <div className="space-y-6 max-w-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Registration</label>
              <p className="text-sm text-muted-foreground">
                Allow new users to register on your website
              </p>
            </div>
            <Switch
              checked={enableRegistration}
              onCheckedChange={setEnableRegistration}
            />
          </div>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};