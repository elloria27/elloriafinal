
import { BulkBenefitsContent } from "@/types/content-blocks";

interface BulkBenefitsProps {
  content: BulkBenefitsContent;
}

export const BulkBenefits = ({ content }: BulkBenefitsProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features?.map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Using lucide-react dynamically */}
              <div className="text-primary mb-4 text-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

