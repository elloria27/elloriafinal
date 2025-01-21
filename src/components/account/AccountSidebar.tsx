import { User, FileText, Clock, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
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

export function AccountSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
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
      </SidebarContent>
    </Sidebar>
  );
}