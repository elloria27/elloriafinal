
import { ThanksWelcomeContent } from "@/types/content-blocks";

interface ThanksWelcomeProps {
  content: ThanksWelcomeContent;
}

export const ThanksWelcome = ({ content }: ThanksWelcomeProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{content.title || "Thank You!"}</h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8">{content.subtitle || "We appreciate your trust in our products."}</p>
      {content.promoCode && (
        <div className="bg-accent-purple/20 p-6 rounded-xl inline-block">
          <p className="text-sm text-gray-600 mb-2">Use this promo code on your next purchase:</p>
          <code className="text-xl md:text-2xl font-mono font-bold text-primary">{content.promoCode}</code>
        </div>
      )}
    </div>
  );
};

