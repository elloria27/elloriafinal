import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const CurrencySelector = () => {
  const [currentCurrency, setCurrentCurrency] = useState("CAD");

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
          <button
            onClick={() => setCurrentCurrency("CAD")}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              currentCurrency === "CAD"
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-100"
            }`}
          >
            CAD ($)
          </button>
          <button
            onClick={() => setCurrentCurrency("USD")}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              currentCurrency === "USD"
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-100"
            }`}
          >
            USD ($)
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};