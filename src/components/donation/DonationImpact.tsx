interface DonationImpactProps {
  content: {
    title?: string;
    description?: string;
    impacts?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

export const DonationImpact = ({ content }: DonationImpactProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p>{content.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.impacts?.map((impact, index) => (
          <div key={index} className="p-4 border rounded-lg shadow">
            <div className="flex items-center">
              <img src={impact.icon} alt={impact.title} className="h-8 w-8 mr-2" />
              <h3 className="font-semibold">{impact.title}</h3>
            </div>
            <p>{impact.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
