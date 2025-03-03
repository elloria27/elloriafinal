
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

export const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Database['public']['Enums']['supported_language']>("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('site_settings')
          .select('default_language')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          console.log('Fetched default language:', data.default_language);
          setCurrentLanguage(data.default_language);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        // Don't show toast during initial loading - might be part of setup
        if (!isLoading) {
          toast.error("Failed to load language settings");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        (payload) => {
          console.log('Site settings changed:', payload);
          const newData = payload.new as SiteSettings;
          if (newData) {
            setCurrentLanguage(newData.default_language);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoading]);

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case "en":
        return "English";
      case "fr":
        return "Français (Coming Soon)";
      case "uk":
        return "Українська (Coming Soon)";
      default:
        return code.toUpperCase();
    }
  };

  const getLanguageCode = (code: string) => {
    return code.toUpperCase();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
        >
          <Globe className="h-5 w-5" />
          <span className="text-xs font-medium">{getLanguageCode(currentLanguage)}</span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="space-y-2">
          {["en", "fr", "uk"].map((lang) => (
            <button
              key={lang}
              onClick={() => lang === "en" && setCurrentLanguage(lang as Database['public']['Enums']['supported_language'])}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                currentLanguage === lang
                  ? "bg-primary/10 text-primary"
                  : lang === "en"
                  ? "hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={lang !== "en"}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
