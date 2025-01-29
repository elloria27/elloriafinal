import { PersonalInfoForm } from "./PersonalInfoForm";
import { LocationForm } from "./LocationForm";
import { ProfileActions } from "./ProfileActions";
import { ProfileHeader } from "./ProfileHeader";

interface MainProfileContentProps {
  profile: any;
  loading: boolean;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  userEmail: string | null;
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
}: MainProfileContentProps) => {
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!profile) {
    return <div className="p-4">No profile found.</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        email={userEmail}
        phoneNumber={phoneNumber}
        address={address}
        country={country}
        region={region}
        language={profile.language || 'en'}
        currency={profile.currency || 'USD'}
      />

      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-6 mt-6">
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
        />

        <LocationForm
          country={country}
          setCountry={setCountry}
          region={region}
          setRegion={setRegion}
        />

        <ProfileActions
          hasChanges={hasChanges}
          isSaving={isSaving}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};