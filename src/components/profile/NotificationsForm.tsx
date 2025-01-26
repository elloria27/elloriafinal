import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationsFormProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  marketingEmails: boolean;
  setMarketingEmails: (value: boolean) => void;
}

export const NotificationsForm = ({
  emailNotifications,
  setEmailNotifications,
  marketingEmails,
  setMarketingEmails,
}: NotificationsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email notifications about your account
          </p>
        </div>
        <Switch
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Marketing Emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive updates about new products and features
          </p>
        </div>
        <Switch
          checked={marketingEmails}
          onCheckedChange={setMarketingEmails}
        />
      </div>
    </div>
  );
};