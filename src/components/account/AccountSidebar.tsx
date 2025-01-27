import { User, FileText, Clock, Settings, X, LogOut } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log("Signing out user...");
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {onClose && (
        <div className="p-4 md:hidden flex justify-end">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
      )}
      <div className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="mt-6">Menu</SidebarGroupLabel>
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
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
      
      <div className="p-4 mt-auto border-t">
        <Button 
          variant="destructive" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}