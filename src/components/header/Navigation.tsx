import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePages } from "@/contexts/PagesContext";

export const Navigation = () => {
  const { publishedPages, isLoading } = usePages();

  // Define technical pages that should not appear in the menu
  const technicalPages = [
    'login',
    'register',
    'profile',
    'checkout',
    'product',
    'order-success',
    'admin'
  ];

  const navItems = [
    ...publishedPages
      .filter(page => 
        page.is_published && 
        !technicalPages.includes(page.slug)
      )
      .map(page => ({
        name: page.title,
        path: page.slug === 'index' ? '/' : `/${page.slug}`
      }))
  ];

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  return (
    <nav className="hidden md:flex items-center space-x-12 ml-auto mr-8">
      {navItems.map((item) => (
        <motion.div key={item.name}>
          <Link to={item.path}>
            <motion.span
              className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light cursor-pointer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.name}
            </motion.span>
          </Link>
        </motion.div>
      ))}
    </nav>
  );
};