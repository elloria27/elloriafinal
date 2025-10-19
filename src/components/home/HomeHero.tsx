import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Heart, Shield, Sparkles, Ghost, Moon, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HeroContent } from "@/types/content-blocks";
import ReactPlayer from "react-player";

interface HomeHeroProps {
  content: HeroContent;
}

export const HomeHero = ({ content }: HomeHeroProps) => {
  console.log('HomeHero content received:', content);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const halloweenIcons = [
    { Icon: Ghost, delay: 0, position: { top: "15%", left: "8%" }, color: "text-orange-400" },
    { Icon: Moon, delay: 0.3, position: { top: "60%", left: "12%" }, color: "text-purple-400" },
    { Icon: Star, delay: 0.6, position: { top: "25%", left: "85%" }, color: "text-yellow-400" },
    { Icon: Sparkles, delay: 0.9, position: { top: "75%", left: "82%" }, color: "text-orange-300" },
    { Icon: Ghost, delay: 1.2, position: { top: "45%", left: "5%" }, color: "text-purple-300" },
    { Icon: Heart, delay: 1.5, position: { top: "80%", left: "90%" }, color: "text-orange-400" }
  ];

  const pumpkins = [
    { position: { top: "10%", left: "18%" }, delay: 0.5, size: "text-4xl" },
    { position: { top: "70%", left: "15%" }, delay: 1, size: "text-3xl" },
    { position: { top: "35%", left: "88%" }, delay: 1.5, size: "text-5xl" },
    { position: { top: "85%", left: "85%" }, delay: 2, size: "text-3xl" }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-orange-900/20 via-purple-900/30 to-black/50 overflow-hidden">
      {/* Animated Halloween background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,69,19,0.3),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(75,0,130,0.3),transparent_50%)]" />
      
      {/* Floating bats */}
      {[
        { left: "5%", top: "20%", delay: 0, duration: 8 },
        { left: "15%", top: "60%", delay: 1.5, duration: 10 },
        { left: "75%", top: "15%", delay: 3, duration: 9 },
        { left: "85%", top: "50%", delay: 4.5, duration: 11 },
        { left: "40%", top: "10%", delay: 6, duration: 7 },
        { left: "60%", top: "70%", delay: 7.5, duration: 12 }
      ].map((bat, i) => (
        <motion.div
          key={`bat-${i}`}
          className="absolute text-3xl hidden lg:block z-20"
          style={{ left: bat.left, top: bat.top }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: bat.duration,
            repeat: Infinity,
            delay: bat.delay,
            ease: "easeInOut"
          }}
        >
          🦇
        </motion.div>
      ))}
      
      {/* Animated spider webs in corners */}
      <motion.div
        className="absolute top-0 left-0 text-6xl opacity-30"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🕸️
      </motion.div>
      <motion.div
        className="absolute top-0 right-0 text-6xl opacity-30"
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      >
        🕸️
      </motion.div>
      
      <div className="container px-4 py-16 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Halloween floating icons */}
        {halloweenIcons.map(({ Icon, delay, position, color }, index) => (
          <motion.div
            key={`icon-${index}`}
            className={`absolute hidden lg:block ${color}`}
            style={position}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 4,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-10 h-10 drop-shadow-glow" />
          </motion.div>
        ))}
        
        {/* Floating pumpkins */}
        {pumpkins.map((pumpkin, index) => (
          <motion.div
            key={`pumpkin-${index}`}
            className={`absolute hidden lg:block ${pumpkin.size}`}
            style={pumpkin.position}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 5,
              delay: pumpkin.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎃
          </motion.div>
        ))}
        
        <div className="flex-1 text-center lg:text-left z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
              <span className="bg-gradient-to-r from-orange-400 via-purple-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                {content?.title || "Redefining Comfort, Confidence, and Sustainability"}
              </span>
              <motion.span
                className="inline-block ml-4 text-5xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎃
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-orange-100 mb-8 max-w-2xl mx-auto lg:mx-0 drop-shadow-md"
          >
            {content?.subtitle || "Experience ultra-thin, eco-friendly feminine care made for modern women."}
            <span className="inline-block ml-2">👻</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-6 py-6 text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-400"
                asChild
              >
                <Link to="/shop">
                  {content?.shopNowText || "Shop Now"} 🎃
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-orange-400 text-orange-100 bg-purple-900/50 hover:bg-purple-800/70 px-6 py-6 text-lg rounded-full transition-all duration-300 backdrop-blur-sm"
                asChild
              >
                <Link to="/about">
                  {content?.learnMoreText || "Learn More"} 👻
                </Link>
              </Button>
            </motion.div>
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
          {/* Halloween glow effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/40 via-purple-500/30 to-orange-600/40 rounded-full blur-3xl animate-pulse" />
          
          {/* Floating ghosts around video */}
          <motion.div
            className="absolute -top-8 -left-8 text-4xl z-20"
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            👻
          </motion.div>
          <motion.div
            className="absolute -bottom-8 -right-8 text-4xl z-20"
            animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          >
            🎃
          </motion.div>
          
          <motion.div 
            className="relative z-10 w-full h-full rounded-lg overflow-hidden shadow-2xl border-4 border-orange-500/50"
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
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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