import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  Store,
  Heart,
  BookOpen,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminSidebarProps {
  profile?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  onClose?: () => void;
}

const MENU_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin?tab=dashboard",
  },
  {
    title: "Products",
    icon: Package,
    href: "/admin?tab=products",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin?tab=orders",
  },
  {
    title: "Shop",
    icon: Store,
    items: [
      {
        title: "Payment Methods",
        href: "/admin?tab=payment-methods",
      },
      {
        title: "Delivery Methods",
        href: "/admin?tab=delivery-methods",
      },
      {
        title: "Inventory Management",
        href: "/admin?tab=inventory",
      },
      {
        title: "Promo Codes",
        href: "/admin?tab=promo-codes",
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin?tab=users",
  },
  {
    title: "Content",
    icon: FileText,
    items: [
      {
        title: "Pages",
        href: "/admin?tab=pages",
      },
      {
        title: "Blog",
        href: "/admin?tab=blog",
      },
    ],
  },
  {
    title: "Files",
    icon: FolderOpen,
    href: "/admin?tab=files",
  },
  {
    title: "Media",
    icon: ImageIcon,
    href: "/admin?tab=media",
  },
  {
    title: "Donations",
    icon: Heart,
    href: "/admin?tab=donations",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin?tab=settings",
  },
];

export const AdminSidebar = ({ profile, onClose }: AdminSidebarProps) => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col border-r bg-card">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-semibold">Admin Panel</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {MENU_ITEMS.map((item) => {
            if (item.items) {
              const isExpanded = expandedItems.includes(item.title);
              const isActive = item.items.some(
                (subItem) =>
                  subItem.href.split("=")[1] === currentTab
              );

              return (
                <div key={item.title}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-between", 
                      isActive && "bg-accent"
                    )}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <span className="flex items-center">
                      {item.icon && (
                        <item.icon className="mr-2 h-4 w-4" />
                      )}
                      {item.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </Button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            subItem.href.split("=")[1] === currentTab &&
                              "bg-accent"
                          )}
                          asChild
                          onClick={onClose}
                        >
                          <Link to={subItem.href}>{subItem.title}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Button
                key={item.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  item.href.split("=")[1] === currentTab && "bg-accent"
                )}
                asChild
                onClick={onClose}
              >
                <Link to={item.href}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 rounded-lg border p-4">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={profile?.avatar_url}
              alt={profile?.full_name || "Admin"}
            />
            <AvatarFallback>
              {profile?.full_name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {profile?.full_name || "Admin User"}
            </span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};