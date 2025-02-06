import { DonationPartnersProps } from "./types";

export const DonationPartners = ({ content }: DonationPartnersProps) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title || "Our Partners"}</h2>
        <p className="text-center text-gray-600 mb-12">{content.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.partners?.map((partner, index) => (
            <div key={index} className="flex items-center justify-center">
              <img src={partner} alt="Partner logo" className="max-h-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};