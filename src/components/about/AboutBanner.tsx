import { motion } from "framer-motion";

export const AboutBanner = () => {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/30 to-accent-peach/30" />
      <div 
        className="absolute inset-0 bg-[url('/lovable-uploads/a7e9335a-6251-4ad6-9140-b04479d11e77.png')] bg-cover bg-center"
        style={{ backgroundAttachment: 'fixed' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Empowering Every Woman
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Creating innovative solutions for feminine care that prioritize comfort, 
            confidence, and sustainability
          </p>
        </motion.div>
      </div>
    </div>
  );
};