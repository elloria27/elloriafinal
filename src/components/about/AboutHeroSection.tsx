import { motion } from "framer-motion";

export const AboutHeroSection = () => {
  return (
    <section className="relative h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/30 to-accent-peach/30" />
      <div 
        className="absolute inset-0 bg-[url('/lovable-uploads/a7e9335a-6251-4ad6-9140-b04479d11e77.png')] bg-cover bg-center"
        style={{ backgroundAttachment: 'fixed' }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container px-4 text-center"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering Women. <br />
            Protecting the Planet.
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover how Elloria is redefining feminine care with sustainability, 
            innovation, and care.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};