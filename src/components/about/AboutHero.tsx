import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const AboutHero = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-r from-accent-peach/20 to-accent-purple/20">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Empowering Women Through
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                Innovative Care
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              We're revolutionizing feminine care with sustainable, comfortable, and reliable products 
              that put your comfort and confidence first.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Our Mission"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};