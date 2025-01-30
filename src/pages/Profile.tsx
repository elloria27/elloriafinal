import { Activity } from "./profile/Activity";
import { Invoices } from "./profile/Invoices";
import { MainProfile } from "./profile/MainProfile";
import { Settings } from "./profile/Settings";
import { Routes, Route } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader />
      <ProfileActions />
      <div className="mt-8">
        <Routes>
          <Route path="/" element={<MainProfile />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profile;