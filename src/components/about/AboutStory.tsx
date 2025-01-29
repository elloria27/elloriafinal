import { motion } from "framer-motion";
import { AboutStoryContent } from "@/types/content-blocks";
import { useRef, useState, useEffect } from "react";
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
    videoUrl = "",
    videoThumbnail = ""
  } = content;

  console.log("AboutStory received content:", content);
  console.log("Video URL:", videoUrl);
  console.log("Video Thumbnail:", videoThumbnail);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Preload video when component mounts
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.preload = "auto"; // Force preload
      // Start loading the video
      videoRef.current.load();
      console.log("Preloading video:", videoUrl);
    }
  }, [videoUrl]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      try {
        if (!isPlaying) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log("Video started playing successfully");
              })
              .catch(error => {
                console.error("Error playing video:", error);
                setVideoError("Failed to play video");
              });
          }
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } catch (error) {
        console.error("Error handling video playback:", error);
        setVideoError("Error playing video");
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoError = (e: any) => {
    console.error("Video error:", e);
    setVideoError("Error loading video");
    setIsVideoLoaded(false);
  };

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
              {videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    onLoadedData={() => {
                      setIsVideoLoaded(true);
                      setVideoError(null);
                      console.log("Video loaded successfully");
                    }}
                    onError={handleVideoError}
                    poster={videoThumbnail}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <p className="text-white">{videoError}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">No video selected</p>
                </div>
              )}

              <AnimatePresence>
                {videoUrl && (!isPlaying || !isVideoLoaded) && !videoError && (
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

                {videoUrl && isPlaying && isHovering && !videoError && (
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
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-primary" />
                        ) : (
                          <Play className="w-5 h-5 text-primary ml-0.5" />
                        )}
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