import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutSustainability } from "@/components/about/AboutSustainability";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutCustomerImpact } from "@/components/about/AboutCustomerImpact";
import { ContentBlock } from "@/types/content-blocks";
import { useQuery } from "@tanstack/react-query";

const fetchAboutPageContent = async () => {
  console.log("Fetching about page content...");
  
  // First, get the page ID for the about page
  const { data: pageData, error: pageError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'about')
    .single();

  if (pageError) {
    console.error("Error fetching page:", pageError);
    throw pageError;
  }

  if (!pageData) {
    console.error("No page found with slug 'about'");
    throw new Error("Page not found");
  }

  // Then fetch all content blocks for this page
  const { data: blocks, error: blocksError } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page_id', pageData.id)
    .order('order_index');

  if (blocksError) {
    console.error("Error fetching content blocks:", blocksError);
    throw blocksError;
  }

  console.log("Fetched content blocks:", blocks);
  return blocks;
};

export default function About() {
  const { data: contentBlocks, isLoading, error } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: fetchAboutPageContent
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    console.error("Error loading content:", error);
    return <div className="min-h-screen flex items-center justify-center">Error loading content</div>;
  }

  const getBlockContent = (type: string) => {
    const block = contentBlocks?.find(block => block.type === type);
    return block?.content || {};
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <AboutHeroSection 
        content={getBlockContent('about_hero_section')}
      />

      <AboutStory 
        content={getBlockContent('about_story')}
      />

      <AboutValues 
        content={getBlockContent('about_mission')}
      />

      <AboutSustainability 
        content={getBlockContent('about_sustainability')}
      />

      <AboutTeam 
        content={getBlockContent('about_team')}
      />

      <AboutCustomerImpact 
        content={getBlockContent('about_customer_impact')}
      />

      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            {(() => {
              const ctaContent = getBlockContent('about_cta');
              return (
                <>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    {ctaContent.title || "Join the Elloria Movement"}
                  </h2>
                  <p className="text-xl mb-8">
                    {ctaContent.subtitle || "Experience the perfect blend of comfort, protection, and sustainability."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold"
                    >
                      {ctaContent.primaryButtonText || "Shop Now"}
                    </button>
                    <button 
                      className="border-2 border-white text-white hover:bg-white/20 px-6 py-3 rounded-lg font-semibold"
                    >
                      {ctaContent.secondaryButtonText || "Learn More"}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}