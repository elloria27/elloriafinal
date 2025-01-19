import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Heart, Shield } from "lucide-react";

export const Hero = () => {
  const floatingIcons = [
    { Icon: Leaf, delay: 0 },
    { Icon: Heart, delay: 0.2 },
    { Icon: Shield, delay: 0.4 }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/10 via-white to-accent-purple/10">
      <div className="container px-4 py-16 flex flex-col lg:flex-row items-center gap-12 relative">
        {floatingIcons.map(({ Icon, delay }, index) => (
          <motion.div
            key={index}
            className="absolute hidden lg:block"
            style={{
              top: `${20 + index * 30}%`,
              left: `${10 + index * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
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
        
        <div className="flex-1 text-center lg:text-left z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Experience <span className="text-primary">Premium</span> <br />
            Comfort with <br />
            <span className="text-secondary">Eco-Conscious</span> Care
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl"
          >
            Discover our revolutionary ultra-thin protection made with sustainable materials, 
            designed to keep you comfortable while protecting our planet.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
              Shop Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-purple/20 via-accent-peach/20 to-accent-green/20 rounded-full blur-3xl" />
          <img 
            src="/lovable-uploads/5064d341-66ba-411d-8a91-8781d383f256.png"
            alt="Elloria Premium Sanitary Pads"
            className="w-full max-w-[600px] mx-auto relative z-10 animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
};