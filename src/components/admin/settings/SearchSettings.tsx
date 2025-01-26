import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const SearchSettings = ({ settings }: { settings: any }) => {
  const [enableSearchIndexing, setEnableSearchIndexing] = useState(
    settings?.enable_search_indexing || false
  );
  const [metaDescription, setMetaDescription] = useState(
    settings?.meta_description || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(settings?.meta_keywords || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          enable_search_indexing: enableSearchIndexing,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("Search settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (error) {
      console.error("Error updating search settings:", error);
      toast.error("Failed to update search settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Search Engine Settings</h3>
        <div className="space-y-6 max-w-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Search Indexing</label>
              <p className="text-sm text-muted-foreground">
                Allow search engines to index your website
              </p>
            </div>
            <Switch
              checked={enableSearchIndexing}
              onCheckedChange={setEnableSearchIndexing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Description</label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Keywords</label>
            <Textarea
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="Enter meta keywords (comma-separated)"
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