import { DonationImpactProps } from "./types";

export const DonationImpact = ({ content }: DonationImpactProps) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{content.title || "Your Impact"}</h2>
        <p className="text-center text-gray-600 mb-12">{content.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.impacts?.map((impact, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">{impact.icon}</div>
              <h3 className="font-semibold mb-2">{impact.title}</h3>
              <p className="text-gray-600">{impact.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};