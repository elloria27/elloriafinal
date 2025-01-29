import { Link } from "react-router-dom";
import { usePages } from "@/contexts/PagesContext";
import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  path: string;
  children?: MenuItem[];
}

export const Navigation = () => {
  const { publishedPages, isLoading } = usePages();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  // Define technical pages that should not appear in the menu
  const technicalPages = [
    'login', 'register', 'profile', 'product', 'checkout', 'order-success',
    'bulk-orders', 'custom-solutions', 'sustainability-program', 'admin',
    'terms', 'shared-file'
  ];

  if (isLoading) {
    return null;
  }

  // Filter and sort pages for the menu
  const menuItems: MenuItem[] = publishedPages
    .filter(page => 
      page.show_in_header && 
      !technicalPages.includes(page.slug) &&
      !page.parent_id // Only get top-level items first
    )
    .sort((a, b) => a.menu_order - b.menu_order)
    .map(page => {
      // Find children for this page
      const children = publishedPages
        .filter(childPage => 
          childPage.show_in_header && 
          childPage.parent_id === page.id
        )
        .sort((a, b) => a.menu_order - b.menu_order)
        .map(childPage => ({
          name: childPage.title,
          path: `/${childPage.slug}`,
        }));

      return {
        name: page.title,
        path: `/${page.slug}`,
        children: children.length > 0 ? children : undefined,
      };
    });

  const handleMouseEnter = (path: string) => {
    if (!isMobile) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      setHoveredItem(path);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setHoveredItem(null);
      }, 300); // 300ms delay before hiding submenu
    }
  };

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    if (isMobile && item.children?.length) {
      e.preventDefault(); // Prevent navigation if item has children on mobile
      setExpandedMobileItem(expandedMobileItem === item.path ? null : item.path);
    }
  };

  const MenuItem = ({ item }: { item: MenuItem }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMobileItem === item.path;
    
    return (
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter(item.path)}
        onMouseLeave={handleMouseLeave}
      >
        <Link 
          to={item.path}
          onClick={(e) => handleItemClick(item, e)}
          className="block"
        >
          <motion.span
            className="flex items-center text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light cursor-pointer"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {item.name}
            {hasChildren && (
              <ChevronDown 
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  (isExpanded || (!isMobile && hoveredItem === item.path)) ? 'rotate-180' : ''
                }`} 
              />
            )}
          </motion.span>
        </Link>
        
        {hasChildren && ((!isMobile && hoveredItem === item.path) || (isMobile && isExpanded)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`
              ${isMobile ? 'relative mt-2 bg-gray-50' : 'absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg'}
              min-w-[200px] py-2 z-50
            `}
          >
            {item.children.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
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
    <nav className="hidden md:flex items-center space-x-8">
      {menuItems.map((item) => (
        <MenuItem key={item.path} item={item} />
      ))}
    </nav>
  );
};