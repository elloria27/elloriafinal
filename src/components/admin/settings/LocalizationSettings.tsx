import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const LocalizationSettings = ({ settings }: { settings: any }) => {
  const [defaultLanguage, setDefaultLanguage] = useState(
    settings?.default_language || "en"
  );
  const [defaultCurrency, setDefaultCurrency] = useState(
    settings?.default_currency || "USD"
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
          default_language: defaultLanguage,
          default_currency: defaultCurrency,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("Localization settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (error) {
      console.error("Error updating localization settings:", error);
      toast.error("Failed to update localization settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Localization Settings</h3>
        <div className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Language</label>
            <Select
              value={defaultLanguage}
              onValueChange={setDefaultLanguage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="uk">Ukrainian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Currency</label>
            <Select
              value={defaultCurrency}
              onValueChange={setDefaultCurrency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="UAH">UAH (₴)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};