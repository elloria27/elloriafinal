import { User, FileText, Clock, Settings, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Invoices",
    icon: FileText,
    path: "/profile/invoices",
  },
  {
    title: "Recent Activity",
    icon: Clock,
    path: "/profile/activity",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/profile/settings",
  },
];

interface AccountSidebarProps {
  onClose?: () => void;
}

export function AccountSidebar({ onClose }: AccountSidebarProps) {
  const location = useLocation();

  return (
    <>
      {onClose && (
        <div className="p-4 md:hidden flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
      <SidebarGroup>
        <SidebarGroupLabel className="mt-6">Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent-purple/50"
                    }`}
                    onClick={onClose}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}