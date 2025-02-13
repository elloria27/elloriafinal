
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Logo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('logo_url')
        .single();

      if (!error && data?.logo_url) {
        setLogoUrl(data.logo_url);
      }
    };

    fetchLogo();
  }, []);

  return (
    <motion.a 
      href="/" 
      className="h-6 md:h-8" // Reduced height for mobile, original size for desktop
      whileHover={{ scale: 1.02 }}
    >
      <img 
        src={logoUrl || "/lovable-uploads/08d815c8-551d-4278-813a-fe884abd443d.png"}
        alt="Elloria" 
        className="h-full w-auto"
      />
    </motion.a>
  );
};
