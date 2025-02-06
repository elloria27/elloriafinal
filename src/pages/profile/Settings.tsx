import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', 'currentUserId') // Replace with actual user ID
          .single();

        if (error) throw error;

        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (formData: { [key: string]: any }) => {
    try {
      const updates = {
        ...formData,
        id: user?.id, // Add the required id property
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error("Failed to update settings");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Profile Settings</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        handleSubmit(data);
      }}>
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input id="full_name" name="full_name" defaultValue={user?.full_name} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" defaultValue={user?.email} />
        </div>
        <div>
          <label htmlFor="phone_number">Phone Number</label>
          <input id="phone_number" name="phone_number" defaultValue={user?.phone_number} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;
