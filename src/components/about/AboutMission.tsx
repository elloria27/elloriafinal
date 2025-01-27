import { AboutMissionContent } from "@/types/content-blocks";

interface AboutMissionProps {
  content?: AboutMissionContent;
}

export const AboutMission = ({ content }: AboutMissionProps) => {
  if (!content) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{content.title || 'Our Mission'}</h2>
          <p className="text-xl text-gray-600 mb-8">{content.subtitle || 'Making a difference through sustainable innovation'}</p>
          <p className="text-gray-600">{content.description || 'Description of our mission and values'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {(content.values || []).map((value, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};