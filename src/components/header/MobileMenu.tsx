import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from "./LanguageSelector";
import { UserMenu } from "./UserMenu";
import { usePages } from "@/contexts/PagesContext";
import { useState } from "react";

interface MenuItem {
  name: string;
  path: string;
  children?: MenuItem[];
}

export const MobileMenu = () => {
  const { publishedPages, isLoading } = usePages();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const technicalPages = [
    'login',
    'register',
    'profile',
    'checkout',
    'product',
    'order-success',
    'admin'
  ];

  const buildMenuTree = (pages: any[], parentId: string | null = null): MenuItem[] => {
    return pages
      .filter(page => 
        page.is_published && 
        !technicalPages.includes(page.slug) &&
        page.show_in_header &&
        page.parent_id === parentId
      )
      .sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0))
      .map(page => ({
        name: page.title,
        path: page.slug === 'index' ? '/' : `/${page.slug}`,
        children: buildMenuTree(pages, page.id)
      }));
  };

  const menuItems = buildMenuTree(publishedPages);

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path)
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const handleNavigate = () => {
    setOpen(false);
  };

  const MenuItem = ({ item, level = 0 }: { item: MenuItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);

    return (
      <motion.div 
        className="w-full"
        initial={false}
        animate={{ height: "auto" }}
      >
        <div className={`relative ${level > 0 ? 'ml-4' : ''}`}>
          <div className="flex items-center">
            <Link 
              to={item.path}
              onClick={handleNavigate}
              className="flex-1 p-3 text-base text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              {item.name}
            </Link>
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(item.path)}
                className="p-3 text-gray-500 hover:text-primary transition-colors"
                aria-label={isExpanded ? "Collapse submenu" : "Expand submenu"}
              >
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="block text-sm"
                >
                  ▼
                </motion.span>
              </button>
            )}
          </div>

          {hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="py-2 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={handleNavigate}
                    className="block p-3 pl-6 text-base text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden hover:bg-primary/5 -mr-2"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-xl flex flex-col p-0"
      >
        <SheetHeader className="p-6 border-b border-gray-100">
          <SheetTitle className="text-left font-light tracking-[0.2em] text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ELLORIA
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <UserMenu onClose={() => setOpen(false)} />
            <LanguageSelector />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};