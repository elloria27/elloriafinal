import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePages } from "@/contexts/PagesContext";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface MenuItem {
  name: string;
  path: string;
  children?: MenuItem[];
}

export const Navigation = () => {
  const { publishedPages, isLoading } = usePages();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Define technical pages that should not appear in the menu
  const technicalPages = [
    'login',
    'register',
    'profile',
    'checkout',
    'product',
    'order-success',
    'admin',
    'terms'
  ];

  const buildMenuTree = (pages: any[], parentId: string | null = null): MenuItem[] => {
    console.log('Building menu tree for parent:', parentId);
    console.log('Available pages:', pages);
    
    const menuItems = pages
      .filter(page => 
        page.is_published && 
        !technicalPages.includes(page.slug) &&
        page.show_in_header &&
        page.parent_id === parentId
      )
      .sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0))
      .map(page => {
        const children = buildMenuTree(pages, page.id);
        console.log(`Page ${page.title} has ${children.length} children`);
        
        return {
          name: page.title,
          path: page.slug === 'index' ? '/' : `/${page.slug}`,
          children: children.length > 0 ? children : undefined
        };
      });

    return menuItems;
  };

  const menuItems = buildMenuTree(publishedPages);

  if (isLoading) {
    return null;
  }

  console.log('Final Menu Items:', menuItems);

  const MenuItem = ({ item }: { item: MenuItem }) => {
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div
        className="relative"
        onMouseEnter={() => setHoveredItem(item.path)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Link to={item.path}>
          <motion.span
            className="flex items-center text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light cursor-pointer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {item.name}
            {hasChildren && (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </motion.span>
        </Link>
        
        {hasChildren && hoveredItem === item.path && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 top-full mt-2 py-2 bg-white rounded-lg shadow-lg min-w-[200px] z-50"
          >
            {item.children.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                {child.name}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <nav className="hidden md:flex items-center space-x-12 ml-auto mr-8">
      {menuItems.map((item) => (
        <MenuItem key={item.path} item={item} />
      ))}
    </nav>
  );
};