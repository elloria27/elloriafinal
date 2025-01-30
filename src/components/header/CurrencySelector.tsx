import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/integrations/supabase/types";

type SupportedCurrency = Database['public']['Enums']['supported_currency'];

export const CurrencySelector = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>("USD");

  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      const { data: settings, error } = await supabase
        .from('shop_settings')
        .select('default_currency')
        .single();

      if (!error && settings?.default_currency) {
        setSelectedCurrency(settings.default_currency as SupportedCurrency);
      }
    };

    fetchDefaultCurrency();
  }, []);

  const handleCurrencyChange = async (currency: SupportedCurrency) => {
    setSelectedCurrency(currency);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {selectedCurrency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleCurrencyChange("USD")}>
          USD
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange("EUR")}>
          EUR
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange("UAH")}>
          UAH
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange("CAD")}>
          CAD
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};