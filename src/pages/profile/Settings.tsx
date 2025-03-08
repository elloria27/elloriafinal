
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { LocationForm } from "@/components/profile/LocationForm";
import { PreferencesForm } from "@/components/profile/PreferencesForm";
import { ProfileActions } from "@/components/profile/ProfileActions";

interface SettingsProps {
  user: any;
}

const Settings = ({ user }: SettingsProps) => {
  return (
    <div className="space-y-8">
      <ProfileHeader user={user} showSettings={true} />
      
      <div className="space-y-8">
        <PersonalInfoForm user={user} />
        <LocationForm user={user} />
        <PreferencesForm user={user} />
        <ProfileActions user={user} />
      </div>
    </div>
  );
};

export default Settings;
