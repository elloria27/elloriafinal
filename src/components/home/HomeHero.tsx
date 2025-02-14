import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HeroContent } from "@/types/content-blocks";
import ReactPlayer from "react-player";

interface HomeHeroProps {
  content: HeroContent;
}

export const HomeHero = ({ content }: HomeHeroProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Create floating hearts with different sizes and delays
  const floatingHearts = Array.from({ length: 16 }, (_, i) => ({
    delay: i * 0.2,
    size: Math.random() * 0.5 + 0.5,
    position: {
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
    },
    duration: Math.random() * 2 + 3,
    opacity: Math.random() * 0.4 + 0.2,
  }));

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#FFDEE2] via-white to-[#E5DEFF] overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(109.6deg,rgba(253,222,226,0.4) 11.2%,rgba(255,255,255,0.4) 55%,rgba(229,222,255,0.4) 91.1%)",
            "linear-gradient(109.6deg,rgba(229,222,255,0.4) 11.2%,rgba(253,222,226,0.4) 55%,rgba(255,255,255,0.4) 91.1%)",
            "linear-gradient(109.6deg,rgba(255,255,255,0.4) 11.2%,rgba(229,222,255,0.4) 55%,rgba(253,222,226,0.4) 91.1%)",
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />
      
      {/* Floating hearts animation */}
      {floatingHearts.map((heart, index) => (
        <motion.div
          key={index}
          className="absolute hidden lg:block"
          style={heart.position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [-20, -40, -20],
            x: [0, 10, -10, 0],
            rotate: [0, 10, -10, 0],
            scale: [0, heart.size, heart.size],
            opacity: [0, heart.opacity, 0]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart 
            className="w-6 h-6 text-[#D946EF]" 
            fill={index % 2 === 0 ? "#FDE1D3" : "#E5DEFF"}
          />
        </motion.div>
      ))}
      
      {/* Main content */}
      <div className="container px-4 py-16 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 text-center lg:text-left z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              <motion.span 
                className="bg-gradient-to-r from-[#D946EF] via-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {content?.title || "Redefining Comfort, Confidence, and Sustainability"}
              </motion.span>
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
              className="group relative bg-[#D946EF] hover:bg-[#D946EF]/90 text-white px-6 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              asChild
            >
              <Link to="/shop">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#D946EF]/0 via-white/20 to-[#D946EF]/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
                {content?.shopNowText || "Shop Now"}
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                  }}
                >
                  <Heart className="w-5 h-5" />
                </motion.span>
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="relative border-2 border-[#D946EF] text-[#D946EF] hover:bg-[#D946EF]/10 px-6 py-6 text-lg rounded-full transition-all duration-300"
              asChild
            >
              <Link to="/about">
                {content?.learnMoreText || "Learn More"}
                <motion.span
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="ml-2 inline-block"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="flex-1 relative w-full max-w-[660px] aspect-video mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Decorative heart shapes with more dynamic animations */}
          <motion.div
            className="absolute -top-4 -right-4 z-20"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1],
              y: [-4, 4, -4]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className="w-8 h-8 text-[#D946EF]" fill="#D946EF" />
          </motion.div>
          <motion.div
            className="absolute -bottom-4 -left-4 z-20"
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 0.9, 1.1, 1],
              x: [-4, 4, -4]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Heart className="w-8 h-8 text-[#9b87f5]" fill="#9b87f5" />
          </motion.div>

          {/* Glowing background effect */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D946EF]/30 via-[#FDE1D3]/20 to-[#E5DEFF]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div 
            className="relative z-10 w-full h-full rounded-lg overflow-hidden shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ReactPlayer
              url={content?.videoUrl || "https://elloria.ca/Video_290mm.mp4"}
              playing={isPlaying}
              controls={isHovering}
              width="100%"
              height="100%"
              playsinline
              light={content?.videoPoster || false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onBuffer={() => setIsBuffering(true)}
              onBufferEnd={() => setIsBuffering(false)}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "anonymous",
                    preload: "auto"
                  },
                  forceVideo: true,
                }
              }}
              style={{ borderRadius: '0.5rem' }}
              className="object-cover"
            />
            
            <AnimatePresence>
              {isBuffering && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <motion.div 
                      className="w-8 h-8 border-4 border-[#D946EF] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
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
