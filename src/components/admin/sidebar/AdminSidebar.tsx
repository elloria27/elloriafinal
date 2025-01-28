import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  BookOpen,
  Settings,
  ShoppingCart,
  Package,
  FolderIcon,
  ChevronDown,
  Globe,
  Building2,
  ExternalLink,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  items?: { title: string; href: string; icon: React.ElementType }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Site",
    icon: Globe,
    items: [
      { title: "User Management", href: "/admin?tab=users", icon: Users },
      { title: "Page Management", href: "/admin?tab=pages", icon: FileText },
      { title: "Blog Management", href: "/admin?tab=blog", icon: BookOpen },
      { title: "Site Settings", href: "/admin?tab=settings", icon: Settings }
    ]
  },
  {
    title: "Shop",
    icon: ShoppingCart,
    items: [
      { title: "Order Management", href: "/admin?tab=orders", icon: ShoppingCart },
      { title: "Product Management", href: "/admin?tab=products", icon: Package }
    ]
  },
  {
    title: "HRM",
    icon: Building2,
    items: [
      { title: "File Management", href: "/admin?tab=files", icon: FolderIcon }
    ]
  }
];

export const AdminSidebar = ({ profile }: { profile: any }) => {
  const [openSections, setOpenSections] = useState<string[]>(["Site", "Shop", "HRM"]);
  const navigate = useNavigate();

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Hello, {profile?.full_name || 'Admin'} 👋</h2>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => window.open("/", "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Website
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              {item.items ? (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => toggleSection(item.title)}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections.includes(item.title) ? "transform rotate-180" : ""
                      )}
                    />
                  </Button>
                  
                  {openSections.includes(item.title) && (
                    <ul className="pl-4 space-y-2">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link
                              to={subItem.href}
                              className="flex items-center gap-2"
                            >
                              <subItem.icon className="h-4 w-4" />
                              {subItem.title}
                            </Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    to={item.href!}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="destructive" 
          className="w-full flex items-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};