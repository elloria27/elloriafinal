import { DonationStoriesProps } from "@/types/content-blocks";

export const DonationStories = ({ content }: DonationStoriesProps) => {
  return (
    <div className="donation-stories">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="text-lg">{content.description}</p>
      <ul className="mt-4">
        {content.stories.map((story, index) => (
          <li key={index} className="mb-2">
            <h3 className="font-semibold">{story.title}</h3>
            <p>{story.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
