
import { Button } from "@/components/ui/button";
import { BulkHeroContent } from "@/types/content-blocks";

interface BulkHeroProps {
  content: BulkHeroContent;
}

export const BulkHero = ({ content }: BulkHeroProps) => {
  return (
    <section className="bg-gradient-to-b from-accent-purple/30 to-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light mb-6">
            {content?.title || 'Bulk Orders for Your Business'}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {content?.subtitle || 'Get premium feminine care products at competitive wholesale prices'}
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
          >
            {content?.buttonText || 'Request a Quote'}
          </Button>
        </div>
      </div>
    </section>
  );
};
