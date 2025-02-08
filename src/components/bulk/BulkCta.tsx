
import { BulkCtaContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";

interface BulkCtaProps {
  content: BulkCtaContent;
}

export const BulkCta = ({ content }: BulkCtaProps) => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">{content.title}</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">{content.description}</p>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white text-primary hover:bg-gray-100"
        >
          {content.buttonText}
        </Button>
      </div>
    </section>
  );
};

