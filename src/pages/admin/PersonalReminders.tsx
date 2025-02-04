import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { ReminderList } from "@/components/admin/reminders/ReminderList";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

const PersonalReminders = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: reminders, isLoading: remindersLoading, refetch } = useQuery({
    queryKey: ['personal-reminders'],
    queryFn: async () => {
      console.log('Fetching reminders...');
      const { data, error } = await supabase
        .from('hrm_personal_reminders')
        .select('*')
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const handleEdit = (reminder: any) => {
    console.log('Editing reminder:', reminder);
    // Handle edit logic here
  };

  if (profileLoading || remindersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <AdminSidebar profile={profile} />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar profile={profile} onClose={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-6">
            <div className="container mx-auto">
              <ReminderList 
                reminders={reminders || []}
                onEdit={handleEdit}
                onUpdate={refetch}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PersonalReminders;