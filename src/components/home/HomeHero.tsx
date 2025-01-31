import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Heart, Shield, Sparkles, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HeroContent } from "@/types/content-blocks";

interface HomeHeroProps {
  content: HeroContent;
}

export const HomeHero = ({ content }: HomeHeroProps) => {
  console.log('HomeHero content received:', content);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        console.log('Video loaded');
        setIsVideoLoaded(true);
        setIsBuffering(false);
      };

      const handleWaiting = () => {
        console.log('Video buffering');
        setIsBuffering(true);
      };

      const handlePlaying = () => {
        console.log('Video playing');
        setIsBuffering(false);
      };

      const handleError = (e: ErrorEvent) => {
        console.error('Video error:', e);
        setIsBuffering(false);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError as EventListener);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('error', handleError as EventListener);
      };
    }
  }, []);

  const handlePlayVideo = async () => {
    if (!videoRef.current) return;

    try {
      if (!isPlaying) {
        setIsBuffering(true);
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        await videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing/pausing video:', error);
    } finally {
      setIsBuffering(false);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const floatingIcons = [
    { Icon: Leaf, delay: 0, position: { top: "20%", left: "10%" } },
    { Icon: Heart, delay: 0.2, position: { top: "50%", left: "15%" } },
    { Icon: Shield, delay: 0.4, position: { top: "30%", left: "80%" } },
    { Icon: Sparkles, delay: 0.6, position: { top: "70%", left: "75%" } }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-secondary/5 via-white to-accent-purple/10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(109.6deg,rgba(223,234,247,0.4)_11.2%,rgba(244,248,252,0.4)_91.1%)]" />
      
      <div className="container px-4 py-16 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {floatingIcons.map(({ Icon, delay, position }, index) => (
          <motion.div
            key={index}
            className="absolute hidden lg:block"
            style={position}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-8 h-8 text-primary/40" />
          </motion.div>
        ))}
        
        <div className="flex-1 text-center lg:text-left z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent-purple bg-clip-text text-transparent">
                {content?.title || "Redefining Comfort, Confidence, and Sustainability"}
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
          >
            {content?.subtitle || "Experience ultra-thin, eco-friendly feminine care made for modern women."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link to="/shop">{content?.shopNowText || "Shop Now"}</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary/10 px-6 py-6 text-lg rounded-full transition-all duration-300"
              asChild
            >
              <Link to="/about">{content?.learnMoreText || "Learn More"}</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="flex-1 relative w-full max-w-[660px] aspect-video mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-full blur-3xl" />
          <motion.div 
            className="relative z-10 w-full h-full rounded-lg overflow-hidden shadow-xl group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <video 
              ref={videoRef}
              loop 
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
              preload="auto"
              poster={content?.videoPoster || "https://my.elloria.ca/290mmvideo-.jpg"}
            >
              <source src={content?.videoUrl || "https://elloria.ca/Video_290mm.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <AnimatePresence>
              {(isBuffering || !isPlaying || !isVideoLoaded) && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isBuffering ? (
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <Button
                      onClick={handlePlayVideo}
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
                    >
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </Button>
                  )}
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};