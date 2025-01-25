import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { Newsletter } from "@/components/Newsletter";
import { Header } from "@/components/Header";
import { ElevatingEssentials } from "@/components/ElevatingEssentials";
import { GameChanger } from "@/components/GameChanger";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      console.log('Fetching content blocks for home page');
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', '/')
        .single();

      if (pagesError) {
        console.error('Error fetching home page:', pagesError);
        return;
      }

      const { data: blocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_id', pages.id)
        .order('order_index');

      if (blocksError) {
        console.error('Error fetching content blocks:', blocksError);
        return;
      }

      console.log('Content blocks fetched:', blocks);
      setBlocks(blocks);
    };

    fetchBlocks();
  }, []);

  const getBlockContent = (type: string) => {
    const block = blocks.find(b => b.type === type);
    return block?.content || {};
  };

  return (
    <>
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen overflow-hidden pt-16"
      >
        <Hero content={getBlockContent('hero')} />
        <ElevatingEssentials />
        <GameChanger />
        <Features content={getBlockContent('features')} />
        <StoreBrands />
        <Sustainability />
        <ProductCarousel />
        <CompetitorComparison />
        <Testimonials />
        <BlogPreview />
        <Newsletter />
      </motion.main>
    </>
  );
};

export default Index;