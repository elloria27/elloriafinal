import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";

interface AboutHeroContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export const AboutHeroSection = () => {
  const [heroContent, setHeroContent] = useState<AboutHeroContent>({
    title: "Our Story",
    subtitle: "Founded with a vision to revolutionize feminine care through sustainable innovation, Elloria began its journey to create products that care for both women and our planet.",
    backgroundImage: "/lovable-uploads/ba8d9a77-42de-4ec9-8666-53e795a2673c.png"
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data: pages } = await supabase
        .from('pages')
        .select('content_blocks')
        .eq('slug', 'about')
        .single();

      console.log("Fetched pages data for hero:", pages);

      if (pages?.content_blocks) {
        const contentBlocks = (pages.content_blocks as unknown) as ContentBlock[];
        const heroBlock = contentBlocks.find(
          (block: ContentBlock) => block.type === 'about_hero_section'
        );

        console.log("Found hero block:", heroBlock);

        if (heroBlock && 'content' in heroBlock) {
          setHeroContent(heroBlock.content as AboutHeroContent);
        }
      }
    };

    fetchContent();
  }, []);

  return (
    <section className="relative h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/30 to-accent-peach/30" />
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${heroContent.backgroundImage}')`,
          backgroundAttachment: 'fixed' 
        }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container px-4 text-center"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroContent.title}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {heroContent.subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};