import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50 mt-[200px]">
          <AccountSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email notifications about your account activity.</p>
                    </div>
                    <Switch id="notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing Communications</Label>
                      <p className="text-sm text-gray-500">Receive updates about new products and features.</p>
                    </div>
                    <Switch id="marketing" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </>
  );
}