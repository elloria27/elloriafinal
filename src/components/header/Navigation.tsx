import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePages } from "@/contexts/PagesContext";

export const Navigation = () => {
  const { publishedPages, isLoading } = usePages();

  const staticItems = [
    { name: "Features", path: "#features" },
    { name: "Blog", path: "#blog" }
  ];

  const navItems = [
    ...publishedPages
      .filter(page => page.is_published)
      .map(page => ({
        name: page.title,
        path: page.slug === 'index' ? '/' : `/${page.slug}`
      })),
    ...staticItems
  ];

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  return (
    <nav className="hidden md:flex items-center space-x-12 ml-auto mr-8">
      {navItems.map((item) => (
        <motion.div key={item.name}>
          {item.path.startsWith("#") ? (
            <motion.a
              href={item.path}
              className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.name}
            </motion.a>
          ) : (
            <Link to={item.path}>
              <motion.span
                className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.name}
              </motion.span>
            </Link>
          )}
        </motion.div>
      ))}
    </nav>
  );
};