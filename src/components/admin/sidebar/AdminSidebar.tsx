import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  FileText,
  Gift,
  Image,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Newspaper,
  CreditCard,
  Heart,
  Boxes
} from "lucide-react";

interface AdminSidebarProps {
  profile?: any;
  onClose?: () => void;
}

export const AdminSidebar = ({ profile, onClose }: AdminSidebarProps) => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin?tab=dashboard",
      value: "dashboard",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin?tab=analytics",
      value: "analytics",
    },
    {
      title: "Shop",
      icon: <ShoppingCart className="h-5 w-5" />,
      items: [
        {
          title: "Products",
          href: "/admin?tab=products",
          value: "products",
          icon: <Package className="h-5 w-5" />,
        },
        {
          title: "Orders",
          href: "/admin?tab=orders",
          value: "orders",
          icon: <Box className="h-5 w-5" />,
        },
        {
          title: "Inventory",
          href: "/admin?tab=inventory",
          value: "inventory",
          icon: <Boxes className="h-5 w-5" />,
        },
        {
          title: "Promo Codes",
          href: "/admin?tab=promo-codes",
          value: "promo-codes",
          icon: <Tags className="h-5 w-5" />,
        },
        {
          title: "Payment Methods",
          href: "/admin?tab=payment-methods",
          value: "payment-methods",
          icon: <CreditCard className="h-5 w-5" />,
        },
        {
          title: "Delivery Methods",
          href: "/admin?tab=delivery-methods",
          value: "delivery-methods",
          icon: <Truck className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Content",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          title: "Pages",
          href: "/admin?tab=pages",
          value: "pages",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Blog",
          href: "/admin?tab=blog",
          value: "blog",
          icon: <Newspaper className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Media",
      icon: <Image className="h-5 w-5" />,
      items: [
        {
          title: "Files",
          href: "/admin?tab=files",
          value: "files",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Media Library",
          href: "/admin?tab=media",
          value: "media",
          icon: <Image className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin?tab=users",
      value: "users",
    },
    {
      title: "Donations",
      icon: <Heart className="h-5 w-5" />,
      href: "/admin?tab=donations",
      value: "donations",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin?tab=settings",
      value: "settings",
    },
  ];

  return (
    <div className="h-full border-r bg-gray-100/40 p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Gift className="h-6 w-6" />
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.items ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-2 py-1.5 text-sm font-medium text-gray-500">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center space-x-2 rounded-lg px-2 py-1.5 text-sm",
                          currentTab === subItem.value
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                      >
                        {subItem.icon}
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg px-2 py-1.5 text-sm",
                    currentTab === item.value
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};