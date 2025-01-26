import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePages } from "@/contexts/PagesContext";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navigation = () => {
  const { publishedPages, isLoading } = usePages();

  const technicalPages = [
    'login',
    'register',
    'profile',
    'checkout',
    'product',
    'order-success',
    'admin'
  ];

  const mainMenuItems = publishedPages
    .filter(page => 
      page.is_published && 
      !technicalPages.includes(page.slug) &&
      page.show_in_header &&
      page.menu_type === 'main' &&
      !page.parent_id
    )
    .sort((a, b) => a.menu_order - b.menu_order);

  const getSubmenuItems = (parentId: string) => {
    return publishedPages
      .filter(page => 
        page.is_published && 
        !technicalPages.includes(page.slug) &&
        page.show_in_header &&
        page.menu_type === 'submenu' &&
        page.parent_id === parentId
      )
      .sort((a, b) => a.menu_order - b.menu_order);
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationMenu className="hidden md:flex items-center ml-auto mr-8">
      <NavigationMenuList>
        {mainMenuItems.map((item) => {
          const submenuItems = getSubmenuItems(item.id);
          
          if (submenuItems.length > 0) {
            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuTrigger className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light">
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="p-4 w-[200px] space-y-2">
                    {submenuItems.map((subItem) => (
                      <li key={subItem.id}>
                        <Link 
                          to={subItem.slug === 'index' ? '/' : `/${subItem.slug}`}
                          className="block text-sm text-gray-600 hover:text-primary transition-colors py-2"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.id}>
              <Link to={item.slug === 'index' ? '/' : `/${item.slug}`}>
                <motion.span
                  className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light cursor-pointer px-4 py-2 block"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.title}
                </motion.span>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};