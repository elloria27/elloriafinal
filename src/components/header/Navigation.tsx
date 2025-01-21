import { motion } from "framer-motion";

export const Navigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-12 ml-auto mr-8">
      {["Products", "Features", "Sustainability", "About Us", "Blog"].map((item) => (
        <motion.a
          key={item}
          href={`#${item.toLowerCase().replace(" ", "-")}`}
          className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {item}
        </motion.a>
      ))}
    </nav>
  );
};