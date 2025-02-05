interface DonationJoinMovementProps {
  content: {
    title?: string;
    description?: string;
    buttonText?: string;
  };
}

export const DonationJoinMovement = ({ content }: DonationJoinMovementProps) => {
  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="mt-4">{content.description}</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        {content.buttonText}
      </button>
    </div>
  );
};
