
import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { LocationForm } from "@/components/profile/LocationForm";
import { PreferencesForm } from "@/components/profile/PreferencesForm";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { toast } from "sonner";

interface SettingsProps {
  user: any;
}

const Settings = ({ user }: SettingsProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
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
      setLanguage(user.language || 'en');
      setCurrency(user.currency || 'USD');
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
    const initialLanguage = user.language || 'en';
    const initialCurrency = user.currency || 'USD';
    
    const changed = 
      firstName !== initialFirstName ||
      lastName !== initialLastName ||
      phoneNumber !== initialPhoneNumber ||
      address !== initialAddress ||
      country !== initialCountry ||
      region !== initialRegion ||
      language !== initialLanguage ||
      currency !== initialCurrency;
    
    setHasChanges(changed);
  }, [firstName, lastName, phoneNumber, address, country, region, language, currency, user]);

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
          region: region,
          language: language,
          currency: currency
        })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      toast.success('Profile settings updated successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <ProfileHeader 
        firstName={firstName}
        lastName={lastName}
        email={user?.email}
        phoneNumber={phoneNumber}
        address={address}
        country={country}
        region={region}
        language={language}
        currency={currency}
        showSettings={true}
      />
      
      <div className="space-y-8">
        <PersonalInfoForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={user?.email}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          address={address}
          setAddress={setAddress}
          loading={false}
        />
        <LocationForm
          country={country}
          setCountry={setCountry}
          region={region}
          setRegion={setRegion}
        />
        <PreferencesForm
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
          firstName={firstName}
          lastName={lastName}
          email={user?.email}
          phoneNumber={phoneNumber}
          address={address}
          country={country}
          region={region}
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

export default Settings;
