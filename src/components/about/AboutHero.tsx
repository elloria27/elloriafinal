import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const AboutHero = () => {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold leading-tight">
              Our Mission for
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                Better Care
              </span>
            </h2>
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
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Our Mission"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};