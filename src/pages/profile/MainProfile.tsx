
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { MainProfileContent } from "@/components/profile/MainProfileContent";

interface MainProfileProps {
  user: any;
}

const MainProfile = ({ user }: MainProfileProps) => {
  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />
      <MainProfileContent user={user} />
    </div>
  );
};

export default MainProfile;
