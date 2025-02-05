import { DonationJoinMovementProps } from "@/types/content-blocks";

export const DonationJoinMovement = ({ content }: DonationJoinMovementProps) => {
  return (
    <div className="donation-join-movement">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="mt-2">{content.description}</p>
      <a href={content.link} className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded">
        {content.buttonText}
      </a>
    </div>
  );
};
