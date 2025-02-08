
import { Button } from "@/components/ui/button";
import { BulkCtaContent } from "@/types/content-blocks";

interface BulkCtaProps {
  content: BulkCtaContent;
}

export const BulkCta = ({ content }: BulkCtaProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-6">
            {content?.title || 'Ready to Get Started?'}
          </h2>
          <p className="text-gray-600 mb-8">
            {content?.description || 'Join other organizations that trust us for their feminine care needs.'}
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
