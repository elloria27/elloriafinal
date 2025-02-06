import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";

export default function Admin() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
}