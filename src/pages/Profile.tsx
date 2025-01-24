import { AccountSidebar } from "@/components/account/AccountSidebar";
import { MainProfileContent } from "@/components/profile/MainProfileContent";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";

const Profile = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <AccountSidebar onClose={() => {}} />
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden md:block w-72">
              <AccountSidebar />
            </div>
          )}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;