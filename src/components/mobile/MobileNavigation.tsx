import { Home, MessageSquare, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const MobileNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-50">
      <Link
        to="/"
        className={`flex flex-col items-center ${
          isActive("/") ? "text-primary" : "text-gray-500"
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>

      <Link
        to="/chat"
        className={`flex flex-col items-center ${
          isActive("/chat") ? "text-primary" : "text-gray-500"
        }`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="text-xs mt-1">Chat</span>
      </Link>

      <Link
        to="/shop"
        className={`flex flex-col items-center ${
          isActive("/shop") ? "text-primary" : "text-gray-500"
        }`}
      >
        <ShoppingBag className="w-6 h-6" />
        <span className="text-xs mt-1">Shop</span>
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center ${
          isActive("/profile") ? "text-primary" : "text-gray-500"
        }`}
      >
        <User className="w-6 h-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}