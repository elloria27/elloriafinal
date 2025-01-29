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
import { 
  ContentBlock, 
  AboutHeroContent, 
  AboutStoryContent, 
  AboutMissionContent, 
  AboutSustainabilityContent, 
  AboutTeamContent, 
  AboutCustomerImpactContent 
} from "@/types/content-blocks";

export default function About() {
  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['about-page'],
    queryFn: async () => {
      console.log('Fetching about page data');
      
      try {
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'about')
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          throw pageError;
        }

        if (!pageData) {
          console.error('Page not found');
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
          throw blocksError;
        }

        console.log('Fetched content blocks:', blocks);
        return blocks as ContentBlock[];
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    }
  });

  if (error) {
    console.error('Error loading page:', error);
    toast.error('Error loading page content');
    return <div>Error loading page content</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getBlockContent = <T,>(type: string): T => {
    if (!pageData) return {} as T;
    const block = pageData.find(block => block.type === type);
    console.log(`Getting content for block type ${type}:`, block?.content);
    return (block?.content || {}) as T;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutHeroSection content={getBlockContent<AboutHeroContent>('about_hero_section')} />
      <AboutStory content={getBlockContent<AboutStoryContent>('about_story')} />
      <AboutMission content={getBlockContent<AboutMissionContent>('about_mission')} />
      <AboutSustainability content={getBlockContent<AboutSustainabilityContent>('about_sustainability')} />
      <AboutTeam content={getBlockContent<AboutTeamContent>('about_team')} />
      <AboutCustomerImpact content={getBlockContent<AboutCustomerImpactContent>('about_customer_impact')} />
      
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