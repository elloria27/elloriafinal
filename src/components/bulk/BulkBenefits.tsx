
import { BulkBenefitsContent } from "@/types/content-blocks";
import { Package, Clock, Shield } from "lucide-react";

interface BulkBenefitsProps {
  content: BulkBenefitsContent;
}

const iconMap = {
  Package,
  Clock,
  Shield
} as const;

export const BulkBenefits = ({ content }: BulkBenefitsProps) => {
  console.log("BulkBenefits rendering with content:", content);

  if (!content?.title || !content?.features?.length) {
    console.log("BulkBenefits: Missing required content");
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features.map((feature, index) => {
            const IconComponent = (feature.icon && iconMap[feature.icon as keyof typeof iconMap]) || Package;
            return (
              <div key={index} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-primary mb-4">
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
