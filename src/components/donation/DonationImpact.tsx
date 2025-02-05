import { DonationImpactProps } from "@/types/content-blocks";

export const DonationImpact = ({ content }: DonationImpactProps) => {
  return (
    <div className="donation-impact">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="text-lg">{content.description}</p>
      <ul className="impact-list">
        {content.impacts.map((impact, index) => (
          <li key={index} className="impact-item">
            <span className="impact-amount">{impact.amount}</span>
            <span className="impact-description">{impact.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
