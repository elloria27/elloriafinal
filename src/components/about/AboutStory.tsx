import { motion } from "framer-motion";
import { AboutTimeline } from "./AboutTimeline";
import { AboutStoryContent, ContentBlock } from "@/types/content-blocks";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AboutStoryProps {
  content?: AboutStoryContent;
}

export const AboutStory = ({ content = {} }: AboutStoryProps) => {
  const [storyContent, setStoryContent] = useState<AboutStoryContent>(content);

  useEffect(() => {
    const fetchContent = async () => {
      console.log("Fetching about story content");
      try {
        const { data: pages, error } = await supabase
          .from('pages')
          .select('content_blocks')
          .eq('slug', 'about')
          .single();

        if (error) {
          console.error('Error fetching about page:', error);
          return;
        }

        console.log("Fetched pages data:", pages);

        if (pages?.content_blocks) {
          // Type assertion to help TypeScript understand the structure
          const contentBlocks = pages.content_blocks as ContentBlock[];
          const storyBlock = contentBlocks.find(
            (block: ContentBlock) => block.type === 'about_story'
          );

          console.log("Found story block:", storyBlock);

          if (storyBlock && 'content' in storyBlock) {
            // Type assertion to ensure the content is treated as AboutStoryContent
            setStoryContent(storyBlock.content as AboutStoryContent);
          }
        }
      } catch (error) {
        console.error('Error in fetchContent:', error);
      }
    };

    fetchContent();
  }, []);

  const {
    title = "Our Journey",
    subtitle = "Milestones that shaped who we are today",
    videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timeline = [
      {
        year: "2019",
        title: "Our Journey Begins",
        description: "Founded with a vision to revolutionize feminine care through innovation and understanding"
      },
      {
        year: "2020",
        title: "Eco Innovation",
        description: "Launched our first line of biodegradable products, setting new industry standards"
      },
      {
        year: "2021",
        title: "Global Impact",
        description: "Expanded to 50+ countries, touching lives of millions of women worldwide"
      },
      {
        year: "2022",
        title: "Sustainability Award",
        description: "Recognized globally for our commitment to environmental responsibility"
      },
      {
        year: "2023",
        title: "Community First",
        description: "Provided essential products to over 1 million women in underserved communities"
      }
    ]
  } = storyContent;

  // Function to ensure video URL is in embed format
  const getEmbedUrl = (url: string) => {
    console.log("Processing video URL:", url);
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // If it's already an embed URL, return as is
      if (url.includes('embed')) {
        return url;
      }
      
      // Extract video ID from various YouTube URL formats
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Return original URL if no conversion needed or possible
    return url;
  };

  console.log("Rendering AboutStory with content:", storyContent);

  return (
    <section className="py-24 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center mb-24"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-12">{subtitle}</p>
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded-3xl shadow-2xl"
              src={getEmbedUrl(videoUrl)}
              title="Our Journey Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
        <AboutTimeline timeline={Array.isArray(timeline) ? timeline : []} />
      </div>
    </section>
  );
};