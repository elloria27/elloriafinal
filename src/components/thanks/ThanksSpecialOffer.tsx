
import { ThanksSpecialOfferContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";

interface ThanksSpecialOfferProps {
  content: ThanksSpecialOfferContent;
}

export const ThanksSpecialOffer = ({ content }: ThanksSpecialOfferProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="bg-white shadow-lg rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title || "Special Offer"}</h2>
        <p className="text-lg text-gray-600 mb-8">{content.description || "Take advantage of this exclusive offer!"}</p>
        {content.buttonText && content.buttonLink && (
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href={content.buttonLink}>{content.buttonText}</a>
          </Button>
        )}
      </div>
    </div>
  );
};

