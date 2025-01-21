import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Activity() {
  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50 mt-[200px]">
          <AccountSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h1>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-500">No recent activity.</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </>
  );
}