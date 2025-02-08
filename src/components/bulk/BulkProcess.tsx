
import { ClipboardList, MessageSquare, Truck } from "lucide-react";
import { BulkProcessContent, FeatureItem } from "@/types/content-blocks";

interface BulkProcessProps {
  content: BulkProcessContent;
}

const iconMap: Record<string, any> = {
  ClipboardList,
  MessageSquare,
  Truck
};

export const BulkProcess = ({ content }: BulkProcessProps) => {
  return (
    <section className="py-16 bg-accent-green/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-light text-center mb-12">
          {content?.title || 'How It Works'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(content?.features as FeatureItem[] || []).map((step, index) => {
            const IconComponent = step.icon ? iconMap[step.icon] : ClipboardList;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
