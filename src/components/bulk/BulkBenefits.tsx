
import { Package, Shield, Clock } from "lucide-react";
import { BulkBenefitsContent, FeatureItem } from "@/types/content-blocks";

interface BulkBenefitsProps {
  content: BulkBenefitsContent;
}

const iconMap: Record<string, any> = {
  Package,
  Shield,
  Clock
};

export const BulkBenefits = ({ content }: BulkBenefitsProps) => {
  if (!content) {
    return (
      <div className="p-4 border border-dashed border-gray-300 rounded-lg">
        bulk_benefits component
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-light text-center mb-12">
          {content?.title || 'Why Choose Bulk Orders?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(content?.features || []).map((feature, index) => {
            const IconComponent = feature.icon ? iconMap[feature.icon] : Package;
            return (
              <div 
                key={index} 
                className="p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
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
