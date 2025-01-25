import { motion } from "framer-motion";

export const DonationHero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/20" />
      
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/42c0dc8a-d937-4255-9c12-d484082d26e6.png"
          alt="Women supporting women"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Empowering Women,{" "}
            <span className="text-primary">Changing Lives</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-8">
            Join us in our mission to provide essential feminine care products to women
            and girls in need. Together, we can make a difference.
          </p>
        </motion.div>
      </div>
    </section>
  );
};