import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState("EN");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
        >
          <Globe className="h-5 w-5" />
          <span className="text-xs font-medium">{currentLanguage}</span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="space-y-2">
          <button
            onClick={() => setCurrentLanguage("EN")}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              currentLanguage === "EN"
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-100"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setCurrentLanguage("FR")}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              currentLanguage === "FR"
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-100"
            }`}
          >
            Français
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};