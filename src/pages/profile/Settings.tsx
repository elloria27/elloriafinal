import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('email_notifications, marketing_emails')
          .eq('id', user.id)
          .single();

        if (profile) {
          setEmailNotifications(profile.email_notifications || false);
          setMarketingEmails(profile.marketing_emails || false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const updateSetting = async (setting: 'email_notifications' | 'marketing_emails', value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update settings');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ [setting]: value })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50 pt-24">
          <AccountSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive email notifications about your account activity.
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={emailNotifications}
                        onCheckedChange={(checked) => {
                          setEmailNotifications(checked);
                          updateSetting('email_notifications', checked);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing">Marketing Communications</Label>
                        <p className="text-sm text-gray-500">
                          Receive updates about new products and features.
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={marketingEmails}
                        onCheckedChange={(checked) => {
                          setMarketingEmails(checked);
                          updateSetting('marketing_emails', checked);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </>
  );
}