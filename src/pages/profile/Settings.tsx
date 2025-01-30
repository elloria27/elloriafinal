import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

const Settings = () => {
  const [user, setUser] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user data');
      return;
    }

    setUser(data);
    setLoading(false);
  };

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const updates: Database['public']['Tables']['profiles']['Update'] = {
        id: user?.id,
        full_name: formData.get('full_name')?.toString() || null,
        phone_number: formData.get('phone_number')?.toString() || null,
        address: formData.get('address')?.toString() || null,
        country: formData.get('country')?.toString() || null,
        region: formData.get('region')?.toString() || null,
        email_notifications: formData.get('email_notifications') === 'on',
        marketing_emails: formData.get('marketing_emails') === 'on',
        language: formData.get('language')?.toString() || 'en',
        currency: formData.get('currency')?.toString() || 'USD',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleUpdateProfile(formData);
    }} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" defaultValue={user?.full_name || ''} />
      </div>
      <div>
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input id="phone_number" name="phone_number" defaultValue={user?.phone_number || ''} />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" defaultValue={user?.address || ''} />
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" name="country" defaultValue={user?.country || ''} />
      </div>
      <div>
        <Label htmlFor="region">Region</Label>
        <Input id="region" name="region" defaultValue={user?.region || ''} />
      </div>
      <div>
        <Label htmlFor="email_notifications">Email Notifications</Label>
        <Input type="checkbox" id="email_notifications" name="email_notifications" defaultChecked={user?.email_notifications} />
      </div>
      <div>
        <Label htmlFor="marketing_emails">Marketing Emails</Label>
        <Input type="checkbox" id="marketing_emails" name="marketing_emails" defaultChecked={user?.marketing_emails} />
      </div>
      <div>
        <Label htmlFor="language">Language</Label>
        <Input id="language" name="language" defaultValue={user?.language || 'en'} />
      </div>
      <div>
        <Label htmlFor="currency">Currency</Label>
        <Input id="currency" name="currency" defaultValue={user?.currency || 'USD'} />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

export default Settings;
