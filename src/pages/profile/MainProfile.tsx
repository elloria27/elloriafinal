
import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { MainProfileContent } from "@/components/profile/MainProfileContent";
import { toast } from "sonner";

interface MainProfileProps {
  user: any;
}

const MainProfile = ({ user }: MainProfileProps) => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state from user prop
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || user.firstName || '');
      setLastName(user.last_name || user.lastName || '');
      setPhoneNumber(user.phone_number || user.phoneNumber || '');
      setAddress(user.address || '');
      setCountry(user.country || '');
      setRegion(user.region || '');
    }
  }, [user]);

  // Track changes to enable/disable save button
  useEffect(() => {
    if (!user) return;
    
    const initialFirstName = user.first_name || user.firstName || '';
    const initialLastName = user.last_name || user.lastName || '';
    const initialPhoneNumber = user.phone_number || user.phoneNumber || '';
    const initialAddress = user.address || '';
    const initialCountry = user.country || '';
    const initialRegion = user.region || '';
    
    const changed = 
      firstName !== initialFirstName ||
      lastName !== initialLastName ||
      phoneNumber !== initialPhoneNumber ||
      address !== initialAddress ||
      country !== initialCountry ||
      region !== initialRegion;
    
    setHasChanges(changed);
  }, [firstName, lastName, phoneNumber, address, country, region, user]);

  const handleSave = async () => {
    if (!user || !user.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          address: address,
          country: country,
          region: region
        })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      toast.success('Profile updated successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileHeader 
        firstName={firstName}
        lastName={lastName}
        email={user?.email}
        phoneNumber={phoneNumber}
        address={address}
        country={country}
        region={region}
        language={user?.language || 'en'}
        currency={user?.currency || 'USD'}
      />
      <MainProfileContent 
        profile={user}
        loading={loading}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        userEmail={user?.email}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        address={address}
        setAddress={setAddress}
        country={country}
        setCountry={setCountry}
        region={region}
        setRegion={setRegion}
        hasChanges={hasChanges}
        isSaving={isSaving}
        handleSave={handleSave}
      />
    </div>
  );
};

export default MainProfile;
