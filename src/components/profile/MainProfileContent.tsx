
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { LocationForm } from "@/components/profile/LocationForm";
import { ProfileActions } from "@/components/profile/ProfileActions";

interface MainProfileContentProps {
  profile?: any;
  loading: boolean;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  userEmail?: string | null;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  hasChanges: boolean;
  isSaving: boolean;
  handleSave: () => void;
  user?: any;
}

export const MainProfileContent = ({
  profile,
  loading,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  userEmail,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  country,
  setCountry,
  region,
  setRegion,
  hasChanges,
  isSaving,
  handleSave,
  user
}: MainProfileContentProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <PersonalInfoForm
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={userEmail}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        address={address}
        setAddress={setAddress}
        loading={loading}
        user={user || profile}
      />
      
      <LocationForm
        country={country}
        setCountry={setCountry}
        region={region}
        setRegion={setRegion}
        user={user || profile}
      />
      
      <ProfileActions
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
        user={user || profile}
      />
    </div>
  );
};
