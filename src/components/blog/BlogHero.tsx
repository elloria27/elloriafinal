import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const BlogHero = () => {
  const [settings, setSettings] = useState({
    title: "Stay Inspired with Elloria: News, Insights, and Stories",
    subtitle: "Explore the latest updates on feminine care, sustainability, and empowering women",
    backgroundImage: ""
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading blog hero settings...');
      const { data, error } = await supabase
        .from('blog_settings')
        .select('hero_title, hero_subtitle, hero_background_image')
        .single();

      if (error) throw error;

      console.log('Blog hero settings loaded:', data);
      setSettings({
        title: data.hero_title,
        subtitle: data.hero_subtitle,
        backgroundImage: data.hero_background_image || '/lovable-uploads/ba8d9a77-42de-4ec9-8666-53e795a2673c.png'
      });
    } catch (error) {
      console.error('Error loading blog hero settings:', error);
    }
  };

  const scrollToInstagram = () => {
    const element = document.getElementById('instagram-feed');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${settings.backgroundImage})`,
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-full flex flex-col items-center justify-center text-center text-white px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
          {settings.title}
        </h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl">
          {settings.subtitle}
        </p>
        <Button 
          onClick={scrollToInstagram}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white group"
        >
          Start Exploring
          <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </Button>
      </motion.div>
    </section>
  );
};