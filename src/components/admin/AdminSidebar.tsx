import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FileText,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Media",
    icon: Image,
    path: "/admin/media",
  },
  {
    title: "Pages",
    icon: FileText,
    path: "/admin/pages",
  },
  {
    title: "Blog",
    icon: FileText,
    path: "/admin/blog",
  },
  {
    title: "Store",
    icon: ShoppingBag,
    children: [
      {
        title: "Overview",
        path: "/admin/store",
      },
      {
        title: "Products",
        path: "/admin/store/products",
      },
      {
        title: "Orders",
        path: "/admin/store/orders",
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      return;
    }
    toast.success("Signed out successfully");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <div className="mb-4">
                <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </div>
                <div className="ml-8 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "block px-3 py-2 text-sm font-medium rounded-md",
                        location.pathname === child.path
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="absolute bottom-4 w-56">
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md w-full"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};