import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings2, Globe, Search, UserPlus, Code } from "lucide-react";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { LocalizationSettings } from "@/components/admin/settings/LocalizationSettings";
import { SearchSettings } from "@/components/admin/settings/SearchSettings";
import { RegistrationSettings } from "@/components/admin/settings/RegistrationSettings";
import { CustomScriptsSettings } from "@/components/admin/settings/CustomScriptsSettings";

const Settings = () => {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      try {
        console.log("Fetching site settings...");
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .maybeSingle();

        if (error) {
          console.error("Error fetching site settings:", error);
          throw error;
        }

        if (!data) {
          console.log("No settings found, creating default settings...");
          const { data: newSettings, error: createError } = await supabase
            .from("site_settings")
            .insert([
              {
                site_title: "My Website",
                default_language: "en",
                default_currency: "USD",
                enable_registration: true,
                enable_search_indexing: true,
                custom_scripts: []
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating default settings:", createError);
            throw createError;
          }

          return newSettings;
        }

        console.log("Site settings loaded:", data);
        return data;
      } catch (error) {
        console.error("Error in settings query:", error);
        toast.error("Failed to load settings");
        throw error;
      }
    },
  });

  if (error) {
    console.error("Settings error:", error);
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500">Error loading settings. Please try again.</div>
      </div>
    );
  }

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Settings2 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Site Settings</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full flex flex-wrap gap-2 h-auto bg-transparent p-0">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="localization"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Globe className="h-4 w-4 mr-2" />
            Localization
          </TabsTrigger>
          <TabsTrigger 
            value="search"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger 
            value="registration"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Registration
          </TabsTrigger>
          <TabsTrigger 
            value="scripts"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code className="h-4 w-4 mr-2" />
            Custom Scripts
          </TabsTrigger>
        </TabsList>

        <Card className="p-4 md:p-6">
          <TabsContent value="general">
            <GeneralSettings settings={settings} />
          </TabsContent>

          <TabsContent value="localization">
            <LocalizationSettings settings={settings} />
          </TabsContent>

          <TabsContent value="search">
            <SearchSettings settings={settings} />
          </TabsContent>

          <TabsContent value="registration">
            <RegistrationSettings settings={settings} />
          </TabsContent>

          <TabsContent value="scripts">
            <CustomScriptsSettings settings={settings} />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Settings;