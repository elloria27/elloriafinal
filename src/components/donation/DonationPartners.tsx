import { DonationPartnersContent } from "@/types/content-blocks";
import { cn } from "@/lib/utils";

interface DonationPartnersProps {
  content: DonationPartnersContent;
}

export const DonationPartners = ({ content }: DonationPartnersProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center">{content.title}</h2>
        <p className="text-center mb-8">{content.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {content.partners?.map((partner, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow">
              <h3 className="text-lg font-semibold">{partner.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
