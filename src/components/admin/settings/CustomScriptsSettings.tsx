import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface Script {
  id: string;
  name: string;
  content: string;
}

export const CustomScriptsSettings = ({ settings }: { settings: any }) => {
  const [scripts, setScripts] = useState<Script[]>(
    (settings?.custom_scripts as Script[]) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const addScript = () => {
    setScripts([
      ...scripts,
      { id: crypto.randomUUID(), name: "", content: "" },
    ]);
  };

  const removeScript = (id: string) => {
    setScripts(scripts.filter((script) => script.id !== id));
  };

  const updateScript = (id: string, field: "name" | "content", value: string) => {
    setScripts(
      scripts.map((script) =>
        script.id === id ? { ...script, [field]: value } : script
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert Script[] to a format that matches the Json type
      const scriptsJson = scripts.map(script => ({
        ...script,
      })) as Json;

      const { error } = await supabase
        .from("site_settings")
        .update({
          custom_scripts: scriptsJson,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("Custom scripts updated successfully");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (error) {
      console.error("Error updating custom scripts:", error);
      toast.error("Failed to update custom scripts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Scripts</h3>
        <div className="space-y-4">
          {scripts.map((script) => (
            <div
              key={script.id}
              className="space-y-4 p-4 border rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeScript(script.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="space-y-2">
                <label className="text-sm font-medium">Script Name</label>
                <Input
                  value={script.name}
                  onChange={(e) =>
                    updateScript(script.id, "name", e.target.value)
                  }
                  placeholder="e.g., Google Analytics"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Script Content</label>
                <Textarea
                  value={script.content}
                  onChange={(e) =>
                    updateScript(script.id, "content", e.target.value)
                  }
                  placeholder="Paste your script here"
                  className="font-mono text-sm"
                  rows={4}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addScript}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Script
          </Button>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};