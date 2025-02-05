import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Plus, Settings, FileText, Image, ShoppingBag } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("pages");

  const handleMediaSelect = (url: string) => {
    console.log("Selected media:", url);
  };

  const menuItems = [
    {
      title: "Pages",
      icon: <FileText className="w-4 h-4" />,
      onClick: () => navigate("/admin/pages"),
    },
    {
      title: "Media",
      icon: <Image className="w-4 h-4" />,
      onClick: () => navigate("/admin/media"),
    },
    {
      title: "Products",
      icon: <ShoppingBag className="w-4 h-4" />,
      onClick: () => navigate("/admin/products"),
    },
    {
      title: "Settings",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate("/admin/settings"),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="p-4 hover:bg-accent cursor-pointer"
              onClick={item.onClick}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button onClick={() => navigate("/admin/pages/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Page
          </Button>
        </div>

        <div className="mt-8">
          <MediaLibrary onSelect={handleMediaSelect} type="image" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;