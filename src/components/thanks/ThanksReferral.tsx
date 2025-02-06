
import { ThanksReferralContent } from "@/types/content-blocks";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThanksReferralProps {
  content: ThanksReferralContent;
}

export const ThanksReferral = ({ content }: ThanksReferralProps) => {
  return (
    <div className="bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title || "Share With Friends"}</h2>
        <p className="text-lg text-gray-600 mb-8">{content.description || "Share Elloria with friends and receive amazing rewards!"}</p>
        <Button className="bg-primary hover:bg-primary/90">
          <Share2 className="w-4 h-4 mr-2" />
          Share Now
        </Button>
      </div>
    </div>
  );
};

