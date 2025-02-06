import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Settings,
  Users,
  ShoppingBag,
  FileText,
  Gift,
  Folder,
  Tags,
  DollarSign,
} from "lucide-react";

export const AdminSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: ShoppingBag, label: "Products", path: "/admin/products" },
    { icon: FileText, label: "Blog", path: "/admin/blog" },
    { icon: Gift, label: "Promo Codes", path: "/admin/promo-codes" },
    { icon: Folder, label: "Files", path: "/admin/files" },
    { icon: Tags, label: "Orders", path: "/admin/orders" },
    { icon: DollarSign, label: "Donations", path: "/admin/donations" },
    { icon: Bell, label: "Reminders", path: "/admin/reminders" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                      isActive ? "bg-gray-100" : ""
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}