import { motion } from "framer-motion";
import { AboutStoryContent } from "@/types/content-blocks";
import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";

interface AboutStoryProps {
  content?: AboutStoryContent;
}

export const AboutStory = ({ content = {} }: AboutStoryProps) => {
  const {
    title = "Our Story",
    subtitle = "A Journey of Innovation",
    content: storyContent = "Founded with a vision to revolutionize feminine care through sustainable innovation...",
    videoUrl = "https://elloria.ca/Video_290mm.mp4",
    videoThumbnail = "https://my.elloria.ca/290mmvideo-.jpg"
  } = content;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  console.log("Rendering AboutStory with content:", content);
  console.log("Video URL:", videoUrl);
  console.log("Video Thumbnail:", videoThumbnail);

  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold leading-tight">{title}</h2>
            <p className="text-xl text-gray-600">{subtitle}</p>
            <p className="text-lg text-gray-500">{storyContent}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-2xl blur-xl" />
            
            <div className="relative z-10 w-full h-full rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                onLoadedData={() => setIsVideoLoaded(true)}
                poster={videoThumbnail}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <AnimatePresence>
                {(!isPlaying || !isVideoLoaded) && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      onClick={handlePlayVideo}
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
                    >
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </Button>
                  </motion.div>
                )}

                {isPlaying && isHovering && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={handlePlayVideo}
                        className="w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
                      >
                        <Pause className="w-5 h-5 text-primary" />
                      </Button>
                      <Button
                        onClick={handleToggleMute}
                        className="w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-primary" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-primary" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};