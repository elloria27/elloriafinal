import { FeaturesProps } from "@/types/content-blocks";

export const Features = ({ content }: FeaturesProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {content.title && (
          <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>
        )}
        {content.subtitle && (
          <p className="text-lg text-gray-600 text-center mb-12">{content.subtitle}</p>
        )}
        {content.description && (
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            {content.description}
          </p>
        )}
        {content.features && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                {feature.icon && (
                  <div className="w-12 h-12 mb-4 text-primary">
                    <img src={feature.icon} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                {feature.detail && (
                  <p className="mt-2 text-sm text-gray-500">{feature.detail}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};