
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
  LogOut,
  LayoutDashboard,
  Image,
  Lock,
  Tag,
  CreditCard,
  Truck,
  DollarSign,
  Gift,
  Boxes,
  Bell,
  CheckSquare,
  Receipt,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  description?: string;
  items?: {
    title: string;
    href: string;
    icon: React.ElementType;
    description?: string;
  }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Site",
    icon: Globe,
    items: [
      { title: "Dashboard Overview", href: "/admin?tab=dashboard", icon: LayoutDashboard },
      { title: "User Management", href: "/admin?tab=users", icon: Users },
      { title: "Page Management", href: "/admin?tab=pages", icon: FileText },
      { title: "Blog Management", href: "/admin?tab=blog", icon: BookOpen },
      { title: "Media Library", href: "/admin?tab=media", icon: Image },
      { title: "Site Settings", href: "/admin?tab=settings", icon: Settings }
    ]
  },
  {
    title: "Shop",
    icon: ShoppingCart,
    items: [
      { title: "Order Management", href: "/admin?tab=orders", icon: ShoppingCart },
      { title: "Product Management", href: "/admin?tab=products", icon: Package },
      { title: "Inventory Management", href: "/admin?tab=inventory", icon: Boxes },
      { title: "Company Expenses", href: "/admin?tab=company-expenses", icon: DollarSign },
      { title: "Payment Methods", href: "/admin?tab=payment-methods", icon: CreditCard },
      { title: "Delivery Methods", href: "/admin?tab=delivery-methods", icon: Truck },
      { title: "Promo Codes", href: "/admin?tab=promo-codes", icon: Tag }
    ]
  },
  {
    title: "Marketing",
    icon: DollarSign,
    items: [
      { 
        title: "Donations", 
        href: "/admin?tab=donations", 
        icon: Gift,
        description: "View and manage donations"
      },
      {
        title: "Subscriptions",
        href: "/admin?tab=subscriptions",
        icon: Mail,
        description: "Manage newsletter subscriptions"
      }
    ]
  },
  {
    title: "HRM",
    icon: Building2,
    items: [
      { 
        title: "Company Documents", 
        href: "/admin?tab=files", 
        icon: Lock,
        description: "Private company documents (admin only)"
      },
      {
        title: "Personal Reminders",
        href: "/admin?tab=personal-reminders",
        icon: Bell,
        description: "Manage your personal reminders"
      },
      {
        title: "Task Manager",
        href: "/admin?tab=task-manager",
        icon: CheckSquare,
        description: "Manage and assign tasks"
      },
      {
        title: "Invoices",
        href: "/admin?tab=invoices",
        icon: Receipt,
        description: "Manage invoices and billing"
      }
    ]
  }
];

interface AdminSidebarProps {
  profile: any;
  onClose?: () => void;
}

export const AdminSidebar = ({ profile, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
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

  const handleNavigate = (href: string) => {
    navigate(href);
    if (onClose) {
      onClose();
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
          onClick={() => {
            window.open("/", "_blank");
            if (onClose) onClose();
          }}
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
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </span>
                      <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <ul className="pl-4 space-y-2 mt-2">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleNavigate(subItem.href)}
                          >
                            <span className="flex items-center gap-2">
                              <subItem.icon className="h-4 w-4" />
                              {subItem.title}
                            </span>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : item.href ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate(item.href!)}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </span>
                </Button>
              ) : null}
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
