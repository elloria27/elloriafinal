import { DonationStoriesProps } from "./types";

export const DonationStories = ({ content }: DonationStoriesProps) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title || "Impact Stories"}</h2>
        <p className="text-center text-gray-600 mb-12">{content.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.stories?.map((story, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              {story.image && (
                <img src={story.image} alt={story.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
              )}
              <blockquote className="italic mb-4">{story.quote}</blockquote>
              <p className="font-semibold">{story.name}</p>
              <p className="text-gray-600">{story.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};