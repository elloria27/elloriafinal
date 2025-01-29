import { motion } from "framer-motion";
import { AboutStoryContent } from "@/types/content-blocks";
import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";

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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<ReactPlayer | null>(null);

  useEffect(() => {
    // Reset error state when video URL changes
    setError(null);
    setIsReady(false);
  }, [videoUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
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
                  <ReactPlayer
                    ref={setPlayer}
                    url={videoUrl}
                    playing={isPlaying}
                    muted={isMuted}
                    width="100%"
                    height="100%"
                    playsinline
                    loop
                    config={{
                      file: {
                        attributes: {
                          poster: videoThumbnail,
                          preload: 'auto',
                          'webkit-playsinline': true,
                          playsInline: true
                        },
                        forceVideo: true,
                        forceHLS: true,
                        hlsOptions: {
                          enableWorker: true,
                          lowLatencyMode: true,
                          backBufferLength: 90,
                          progressive: true,
                          startLevel: -1,
                          maxBufferLength: 30,
                          maxMaxBufferLength: 600
                        }
                      }
                    }}
                    onReady={() => {
                      console.log("Video is ready to play");
                      setIsReady(true);
                    }}
                    onError={(e) => {
                      console.error("Video error:", e);
                      setError("Error loading video");
                    }}
                    onBuffer={() => console.log("Video buffering...")}
                    onBufferEnd={() => console.log("Video buffering ended")}
                    className="object-cover"
                  />
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <p className="text-white">{error}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">No video selected</p>
                </div>
              )}

              <AnimatePresence>
                {videoUrl && (!isPlaying || !isReady) && !error && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      onClick={handlePlayPause}
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
                    >
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </Button>
                  </motion.div>
                )}

                {videoUrl && isPlaying && isHovering && !error && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={handlePlayPause}
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