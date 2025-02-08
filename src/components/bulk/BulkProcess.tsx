
import { BulkProcessContent } from "@/types/content-blocks";
import { ClipboardList, MessageSquare, Truck } from "lucide-react";

interface BulkProcessProps {
  content: BulkProcessContent;
}

const iconMap: { [key: string]: React.ComponentType } = {
  ClipboardList,
  MessageSquare,
  TruckDelivery: Truck
};

export const BulkProcess = ({ content }: BulkProcessProps) => {
  if (!content) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.features?.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || ClipboardList;
            return (
              <div key={index} className="relative p-6 bg-white rounded-lg shadow-sm">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="text-primary mb-4 text-xl">
                  <IconComponent className="w-6 h-6" />
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
