import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const GeneralSettings = ({ settings }: { settings: any }) => {
  const [siteTitle, setSiteTitle] = useState(settings?.site_title || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ site_title: siteTitle })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("General settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (error) {
      console.error("Error updating general settings:", error);
      toast.error("Failed to update general settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <label htmlFor="site-title" className="text-sm font-medium">
              Site Title
            </label>
            <Input
              id="site-title"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="Enter site title"
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