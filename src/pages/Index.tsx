import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HomeHero } from "@/components/home/HomeHero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { Newsletter } from "@/components/Newsletter";
import { GameChanger } from "@/components/GameChanger";
import { SEOHead } from "@/components/SEOHead";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";
import { ThanksWelcome } from "@/components/thanks/ThanksWelcome";
import { ThanksReferral } from "@/components/thanks/ThanksReferral";
import { ThanksSpecialOffer } from "@/components/thanks/ThanksSpecialOffer";
import { ThanksNewsletter } from "@/components/thanks/ThanksNewsletter";
import { BulkHero } from "@/components/bulk/BulkHero";
import { BulkBenefits } from "@/components/bulk/BulkBenefits";
import { BulkProcess } from "@/components/bulk/BulkProcess";
import { BulkCta } from "@/components/bulk/BulkCta";
import { 
  ContentBlock, 
  BlockContent,
  HeroContent,
  FeaturesContent,
  GameChangerContent,
  StoreBrandsContent,
  SustainabilityContent,
  ProductCarouselContent,
  TestimonialsContent,
  BlogPreviewContent,
  NewsletterContent,
  ThanksWelcomeContent,
  ThanksReferralContent,
  ThanksSpecialOfferContent,
  ThanksNewsletterContent,
  BulkHeroContent,
  BulkBenefitsContent,
  BulkProcessContent,
  BulkCtaContent,
  SustainabilityProgramHeroContent,
  SustainabilityProgramBenefitsContent,
  SustainabilityProgramProcessContent,
  SustainabilityProgramCtaContent
} from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ArrowRight, Leaf, Recycle, Users } from "lucide-react";
import { SustainabilityRegistrationDialog } from "@/components/sustainability/SustainabilityRegistrationDialog";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const { seoData, loading: seoLoading } = useSEO();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        console.log('Fetching homepage content...');
        
        // First, get the homepage slug from site settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('homepage_slug')
          .limit(1)
          .maybeSingle();

        if (settingsError) {
          console.error('Error fetching homepage slug:', settingsError);
          toast.error("Error loading homepage content");
          return;
        }

        // If no settings found or no homepage_slug set, use 'index' as default
        const homepageSlug = settingsData?.homepage_slug || 'index';
        console.log('Homepage slug:', homepageSlug);

        // Then fetch the page content using the slug
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', homepageSlug)
          .maybeSingle();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          toast.error("Error loading page content");
          return;
        }

        if (!pageData) {
          console.log('No page found with slug:', homepageSlug);
          setBlocks([]);
          return;
        }

        console.log('Page ID:', pageData.id);

        // Finally, fetch the content blocks for this page
        const { data: blocksData, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          toast.error("Error loading page content");
          return;
        }

        console.log('Content blocks:', blocksData);

        // Transform the blocks data to match ContentBlock type
        const transformedBlocks = blocksData?.map(block => ({
          ...block,
          content: block.content as BlockContent
        })) || [];

        setBlocks(transformedBlocks);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Error loading page content");
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageContent();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_blocks' },
        () => {
          console.log('Content blocks updated, refreshing...');
          fetchHomePageContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "hero":
        return <HomeHero content={block.content as HeroContent} />;
      case "features":
        return <Features content={block.content as FeaturesContent} />;
      case "game_changer":
        return <GameChanger content={block.content as GameChangerContent} />;
      case "store_brands":
        return <StoreBrands content={block.content as StoreBrandsContent} />;
      case "sustainability":
        return <Sustainability content={block.content as SustainabilityContent} />;
      case "product_carousel":
        return <ProductCarousel content={block.content as ProductCarouselContent} />;
      case "competitor_comparison":
        return <CompetitorComparison content={block.content as BlockContent} />;
      case "testimonials":
        return <Testimonials content={block.content as TestimonialsContent} />;
      case "blog_preview":
        return <BlogPreview content={block.content as BlogPreviewContent} />;
      case "newsletter":
        return <Newsletter content={block.content as NewsletterContent} />;
      case "thanks_welcome":
        return <ThanksWelcome content={block.content as ThanksWelcomeContent} />;
      case "thanks_referral":
        return <ThanksReferral content={block.content as ThanksReferralContent} />;
      case "thanks_special_offer":
        return <ThanksSpecialOffer content={block.content as ThanksSpecialOfferContent} />;
      case "thanks_newsletter":
        return <ThanksNewsletter content={block.content as ThanksNewsletterContent} />;
      case "bulk_hero":
        return <BulkHero content={block.content as BulkHeroContent} />;
      case "bulk_benefits":
        return <BulkBenefits content={block.content as BulkBenefitsContent} />;
      case "bulk_process":
        return <BulkProcess content={block.content as BulkProcessContent} />;
      case "bulk_cta":
        return <BulkCta content={block.content as BulkCtaContent} />;
      case "sustainability_program_hero":
        return <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {(block.content as SustainabilityProgramHeroContent).title}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {(block.content as SustainabilityProgramHeroContent).description}
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setIsDialogOpen(true)}
              >
                {(block.content as SustainabilityProgramHeroContent).buttonText} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>;
      case "sustainability_program_benefits":
        return <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{(block.content as SustainabilityProgramBenefitsContent).title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(block.content as SustainabilityProgramBenefitsContent).benefits.map((benefit, index) => (
                <Card key={index} className="p-6">
                  {/* Dynamically render the icon based on the icon name */}
                  {benefit.icon === 'Leaf' && <Leaf className="h-12 w-12 text-primary mb-4" />}
                  {benefit.icon === 'Users' && <Users className="h-12 w-12 text-primary mb-4" />}
                  {benefit.icon === 'Recycle' && <Recycle className="h-12 w-12 text-primary mb-4" />}
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>;
      case "sustainability_program_process":
        return <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{(block.content as SustainabilityProgramProcessContent).title}</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {(block.content as SustainabilityProgramProcessContent).steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>;
      case "sustainability_program_cta":
        return <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">{(block.content as SustainabilityProgramCtaContent).title}</h2>
              <p className="text-lg mb-8 opacity-90">{(block.content as SustainabilityProgramCtaContent).description}</p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setIsDialogOpen(true)}
              >
                {(block.content as SustainabilityProgramCtaContent).buttonText}
              </Button>
            </div>
          </div>
        </section>;
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={seoData?.meta_title || undefined}
        description={seoData?.meta_description || undefined}
        keywords={seoData?.meta_keywords || undefined}
        canonicalUrl={seoData?.canonical_url || undefined}
        ogTitle={seoData?.og_title || undefined}
        ogDescription={seoData?.og_description || undefined}
        ogImage={seoData?.og_image || undefined}
      />
      <main className="flex-grow pt-20">
        <SustainabilityRegistrationDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />
        {blocks.map((block) => (
          <div key={block.id}>
            {renderBlock(block)}
          </div>
        ))}
      </main>
    </>
  );
};

export default Index;
