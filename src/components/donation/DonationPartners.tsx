import { DonationPartnersProps } from "@/types/content-blocks";

export const DonationPartners = ({ content }: DonationPartnersProps) => {
  return (
    <div className="donation-partners">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="text-lg">{content.description}</p>
      <ul className="partners-list">
        {content.partners.map((partner, index) => (
          <li key={index} className="partner-item">
            <img src={partner.logoUrl} alt={partner.name} className="partner-logo" />
            <span className="partner-name">{partner.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
