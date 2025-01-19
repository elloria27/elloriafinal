import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Heart, Shield, Sparkles } from "lucide-react";

export const Hero = () => {
  const floatingIcons = [
    { Icon: Leaf, delay: 0, position: { top: "20%", left: "10%" } },
    { Icon: Heart, delay: 0.2, position: { top: "50%", left: "15%" } },
    { Icon: Shield, delay: 0.4, position: { top: "30%", left: "80%" } },
    { Icon: Sparkles, delay: 0.6, position: { top: "70%", left: "75%" } }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-secondary/5 via-white to-accent-purple/10 overflow-hidden">
      <div className="container px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary via-secondary to-accent-purple bg-clip-text text-transparent">
              Experience Premium <br />
              Comfort with <br />
              Eco-Conscious Care
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl"
          >
            Discover our revolutionary ultra-thin protection made with sustainable materials, 
            designed to keep you comfortable while protecting our planet.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Shop Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-7 text-lg rounded-full transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-full blur-3xl" />
          <motion.div 
            className="relative z-10 w-full max-w-[600px] mx-auto rounded-lg overflow-hidden shadow-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://elloria.ca/Video_290mm.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};