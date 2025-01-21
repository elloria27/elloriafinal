import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Invoices from "@/pages/profile/Invoices";
import Activity from "@/pages/profile/Activity";
import Settings from "@/pages/profile/Settings";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/invoices" element={<Invoices />} />
        <Route path="/profile/activity" element={<Activity />} />
        <Route path="/profile/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
