import { Activity } from "./profile/Activity";
import Invoices from "./profile/Invoices";
import MainProfile from "./profile/MainProfile";
import Settings from "./profile/Settings";
import { Routes, Route } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { useState } from "react";

const Profile = () => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    country: "",
    region: "",
    language: "en",
    currency: "USD"
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Implement save logic here
    setIsSaving(false);
    setHasChanges(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        email={profileData.email}
        phoneNumber={profileData.phoneNumber}
        address={profileData.address}
        country={profileData.country}
        region={profileData.region}
        language={profileData.language}
        currency={profileData.currency}
      />
      <ProfileActions
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
      />
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