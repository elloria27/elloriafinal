import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }
      fetchProfile();
    };

    checkAuth();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        full_name: String(formData.get("full_name") || ""),
        email: String(formData.get("email") || ""),
        phone_number: String(formData.get("phone_number") || ""),
        address: String(formData.get("address") || ""),
        country: String(formData.get("country") || ""),
        region: String(formData.get("region") || ""),
        language: String(formData.get("language") || "en"),
        currency: String(formData.get("currency") || "USD"),
        email_notifications: formData.get("email_notifications") === "on",
        marketing_emails: formData.get("marketing_emails") === "on",
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
      await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile?.full_name || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={profile?.email || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          defaultValue={profile?.phone_number || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={profile?.address || ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            defaultValue={profile?.country || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            name="region"
            defaultValue={profile?.region || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            name="language"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            defaultValue={profile?.language || "en"}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="uk">Ukrainian</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            name="currency"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            defaultValue={profile?.currency || "USD"}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="UAH">UAH</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="email_notifications"
            name="email_notifications"
            defaultChecked={profile?.email_notifications || false}
          />
          <Label htmlFor="email_notifications">
            Receive order status notifications via email
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="marketing_emails"
            name="marketing_emails"
            defaultChecked={profile?.marketing_emails || false}
          />
          <Label htmlFor="marketing_emails">
            Receive marketing emails about new products and offers
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}