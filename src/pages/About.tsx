import { Header } from "@/components/Header";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutSustainability } from "@/components/about/AboutSustainability";
import { AboutCustomerImpact } from "@/components/about/AboutCustomerImpact";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentBlock, AboutHeroContent, AboutStoryContent, AboutMissionContent, AboutSustainabilityContent, AboutTeamContent, AboutCustomerImpactContent } from "@/types/content-blocks";

export default function About() {
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['about-page'],
    queryFn: async () => {
      console.log('Fetching about page data');
      
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'about')
        .single();

      if (pageError) {
        console.error('Error fetching page:', pageError);
        toast.error('Error loading page content');
        throw pageError;
      }

      if (!pageData) {
        console.error('Page not found');
        toast.error('Page not found');
        throw new Error('Page not found');
      }

      console.log('Found page:', pageData);

      const { data: blocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_id', pageData.id)
        .order('order_index');

      if (blocksError) {
        console.error('Error fetching content blocks:', blocksError);
        toast.error('Error loading page content');
        throw blocksError;
      }

      console.log('Fetched content blocks:', blocks);
      return blocks as ContentBlock[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getBlockContent = (type: string) => {
    const block = pageData?.find(block => block.type === type);
    return block ? block.content : {};
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutHeroSection content={getBlockContent('about_hero_section') as AboutHeroContent} />
      <AboutStory content={getBlockContent('about_story') as AboutStoryContent} />
      <AboutMission content={getBlockContent('about_mission') as AboutMissionContent} />
      <AboutSustainability content={getBlockContent('about_sustainability') as AboutSustainabilityContent} />
      <AboutTeam content={getBlockContent('about_team') as AboutTeamContent} />
      <AboutCustomerImpact content={getBlockContent('about_customer_impact') as AboutCustomerImpactContent} />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Be Part of the Elloria Movement
            </h2>
            <p className="text-xl mb-8">
              Together, we can redefine feminine care and make a positive impact on the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 bg-white/10"
              >
                Sign Up for Updates <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}