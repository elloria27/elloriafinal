import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Bell,
  Box,
  FileText,
  FolderIcon,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  Users,
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
      name: "Dashboard",
      icon: LayoutDashboard,
      value: "dashboard"
    },
    {
      name: "Products",
      icon: Package,
      value: "products"
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      value: "orders"
    },
    {
      name: "Users",
      icon: Users,
      value: "users"
    },
    {
      name: "Pages",
      icon: FileText,
      value: "pages"
    },
    {
      name: "Blog",
      icon: FileText,
      value: "blog"
    },
    {
      name: "Files",
      icon: FolderIcon,
      value: "files"
    },
    {
      name: "Media",
      icon: Box,
      value: "media"
    },
    {
      name: "Promo Codes",
      icon: Tag,
      value: "promo-codes"
    },
    {
      name: "Payment Methods",
      icon: CreditCard,
      value: "payment-methods"
    },
    {
      name: "Delivery Methods",
      icon: Truck,
      value: "delivery-methods"
    },
    {
      name: "Donations",
      icon: Heart,
      value: "donations"
    },
    {
      name: "Inventory",
      icon: Boxes,
      value: "inventory"
    },
    {
      name: "Personal Reminders",
      icon: Bell,
      value: "personal-reminders"
    },
    {
      name: "Settings",
      icon: Settings,
      value: "settings"
    }
  ];

  return (
    <div className="h-full border-r bg-gray-50/40 px-2 py-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.value}
            to={`/admin?tab=${item.value}`}
            onClick={onClose}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              currentTab === item.value && "bg-gray-100 text-gray-900"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};