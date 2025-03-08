
import { useState, useEffect } from "react";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { LocationForm } from "./LocationForm";
import { ProfileActions } from "./ProfileActions";
import { toast } from "sonner";

interface MainProfileContentProps {
  profile?: any;
  loading?: boolean;
  firstName?: string;
  setFirstName?: (value: string) => void;
  lastName?: string;
  setLastName?: (value: string) => void;
  userEmail?: string | null;
  phoneNumber?: string;
  setPhoneNumber?: (value: string) => void;
  address?: string;
  setAddress?: (value: string) => void;
  country?: string;
  setCountry?: (value: string) => void;
  region?: string;
  setRegion?: (value: string) => void;
  hasChanges?: boolean;
  isSaving?: boolean;
  handleSave?: () => void;
  user?: any;
}

export const MainProfileContent = ({
  profile,
  loading = false,
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
  hasChanges = false,
  isSaving = false,
  handleSave,
  user
}: MainProfileContentProps) => {
  // State to track user data when only user object is provided
  const [localFirstName, setLocalFirstName] = useState<string>('');
  const [localLastName, setLocalLastName] = useState<string>('');
  const [localPhoneNumber, setLocalPhoneNumber] = useState<string>('');
  const [localAddress, setLocalAddress] = useState<string>('');
  const [localCountry, setLocalCountry] = useState<string>('');
  const [localRegion, setLocalRegion] = useState<string>('');
  const [localHasChanges, setLocalHasChanges] = useState<boolean>(false);
  const [localIsSaving, setLocalIsSaving] = useState<boolean>(false);

  // Initialize state from user object if direct props aren't provided
  useEffect(() => {
    if (user && !profile) {
      setLocalFirstName(user.first_name || user.firstName || '');
      setLocalLastName(user.last_name || user.lastName || '');
      setLocalPhoneNumber(user.phone_number || user.phoneNumber || '');
      setLocalAddress(user.address || '');
      setLocalCountry(user.country || '');
      setLocalRegion(user.region || '');
    }
  }, [user]);

  // Use local state handler if props handlers aren't provided
  const handleLocalSave = async () => {
    if (!user || !user.id) return;
    
    setLocalIsSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          first_name: localFirstName,
          last_name: localLastName,
          phone_number: localPhoneNumber,
          address: localAddress,
          country: localCountry,
          region: localRegion
        })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      toast.success('Profile updated successfully');
      setLocalHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLocalIsSaving(false);
    }
  };

  // Use provided props or local state
  const effectiveFirstName = firstName !== undefined ? firstName : localFirstName;
  const effectiveLastName = lastName !== undefined ? lastName : localLastName;
  const effectivePhoneNumber = phoneNumber !== undefined ? phoneNumber : localPhoneNumber;
  const effectiveAddress = address !== undefined ? address : localAddress;
  const effectiveCountry = country !== undefined ? country : localCountry;
  const effectiveRegion = region !== undefined ? region : localRegion;
  const effectiveHasChanges = hasChanges !== undefined ? hasChanges : localHasChanges;
  const effectiveIsSaving = isSaving !== undefined ? isSaving : localIsSaving;
  
  const effectiveSetFirstName = setFirstName || ((value: string) => {
    setLocalFirstName(value);
    setLocalHasChanges(true);
  });
  
  const effectiveSetLastName = setLastName || ((value: string) => {
    setLocalLastName(value);
    setLocalHasChanges(true);
  });
  
  const effectiveSetPhoneNumber = setPhoneNumber || ((value: string) => {
    setLocalPhoneNumber(value);
    setLocalHasChanges(true);
  });
  
  const effectiveSetAddress = setAddress || ((value: string) => {
    setLocalAddress(value);
    setLocalHasChanges(true);
  });
  
  const effectiveSetCountry = setCountry || ((value: string) => {
    setLocalCountry(value);
    setLocalHasChanges(true);
  });
  
  const effectiveSetRegion = setRegion || ((value: string) => {
    setLocalRegion(value);
    setLocalHasChanges(true);
  });
  
  const effectiveHandleSave = handleSave || handleLocalSave;
  
  const effectiveProfile = profile || user;
  const effectiveEmail = userEmail || (user?.email || null);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!effectiveProfile) {
    return <div className="p-4">No profile found.</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-6 mt-6">
        <PersonalInfoForm
          firstName={effectiveFirstName}
          setFirstName={effectiveSetFirstName}
          lastName={effectiveLastName}
          setLastName={effectiveSetLastName}
          email={effectiveEmail}
          phoneNumber={effectivePhoneNumber}
          setPhoneNumber={effectiveSetPhoneNumber}
          address={effectiveAddress}
          setAddress={effectiveSetAddress}
          loading={loading}
        />

        <LocationForm
          country={effectiveCountry}
          setCountry={effectiveSetCountry}
          region={effectiveRegion}
          setRegion={effectiveSetRegion}
        />

        <ProfileActions
          hasChanges={effectiveHasChanges}
          isSaving={effectiveIsSaving}
          onSave={effectiveHandleSave}
        />
      </div>
    </div>
  );
};
