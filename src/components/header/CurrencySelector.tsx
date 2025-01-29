import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CurrencySelector = () => {
  const [currentCurrency, setCurrentCurrency] = useState("USD");

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('default_currency')
          .single();

        if (error) throw error;
        
        if (data) {
          console.log('Fetched default currency:', data.default_currency);
          setCurrentCurrency(data.default_currency);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        toast.error("Failed to load currency settings");
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
          if (payload.new) {
            setCurrentCurrency(payload.new.default_currency);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCurrencyLabel = (currency: string) => {
    switch (currency) {
      case "USD":
        return "USD ($)";
      case "EUR":
        return "EUR (€)";
      case "UAH":
        return "UAH (₴)";
      case "CAD":
        return "CAD ($)";
      default:
        return currency;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
        >
          <DollarSign className="h-5 w-5" />
          <span className="text-xs font-medium">{currentCurrency}</span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="space-y-2">
          {["CAD", "USD", "EUR", "UAH"].map((currency) => (
            <button
              key={currency}
              onClick={() => setCurrentCurrency(currency)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                currentCurrency === currency
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100"
              }`}
            >
              {getCurrencyLabel(currency)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};