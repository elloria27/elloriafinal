import { Header } from "@/components/Header";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutSustainability } from "@/components/about/AboutSustainability";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutCustomerImpact } from "@/components/about/AboutCustomerImpact";
import { Link } from "react-router-dom";
import { 
  ContentBlock, 
  AboutHeroContent, 
  AboutStoryContent, 
  AboutMissionContent, 
  AboutSustainabilityContent, 
  AboutTeamContent, 
  AboutCustomerImpactContent, 
  AboutCtaContent 
} from "@/types/content-blocks";
import { useQuery } from "@tanstack/react-query";

const fetchAboutPageContent = async () => {
  console.log("Fetching about page content...");
  
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
    return block?.content as any;
  };

  const ctaContent = getBlockContent('about_cta') as AboutCtaContent;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <AboutHeroSection 
        content={getBlockContent('about_hero_section') as AboutHeroContent}
      />

      <AboutStory 
        content={getBlockContent('about_story') as AboutStoryContent}
      />

      <AboutMission 
        content={getBlockContent('about_mission') as AboutMissionContent}
      />

      <AboutSustainability 
        content={getBlockContent('about_sustainability') as AboutSustainabilityContent}
      />

      <AboutTeam 
        content={getBlockContent('about_team') as AboutTeamContent}
      />

      <AboutCustomerImpact 
        content={getBlockContent('about_customer_impact') as AboutCustomerImpactContent}
      />

      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {ctaContent?.title || "Join the Elloria Movement"}
            </h2>
            <p className="text-xl mb-8">
              {ctaContent?.subtitle || "Experience the perfect blend of comfort, protection, and sustainability."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/shop"
                className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold"
              >
                {ctaContent?.primaryButtonText || "Shop Now"}
              </Link>
              <Link 
                to="/sustainability"
                className="border-2 border-white text-white hover:bg-white/20 px-6 py-3 rounded-lg font-semibold"
              >
                {ctaContent?.secondaryButtonText || "Learn More"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}