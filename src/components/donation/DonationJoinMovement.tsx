import { DonationJoinMovementProps } from "./types";

export const DonationJoinMovement = ({ content }: DonationJoinMovementProps) => {
  return (
    <div className="py-16 px-4 bg-primary/5">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title || "Join Our Movement"}</h2>
        <p className="text-gray-600 mb-8">{content.description}</p>
        <button className="bg-primary text-white py-3 px-8 rounded-lg">
          {content.buttonText || "Get Involved"}
        </button>
      </div>
    </div>
  );
};