import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomerFormProps {
  country: string;
  setCountry: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  profile?: {
    full_name?: string | null;
    phone_number?: string | null;
    address?: string | null;
    country?: string | null;
    region?: string | null;
    email?: string | null;
  } | null;
  onFormChange?: (field: string, value: string) => void;
}

const COUNTRIES = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
];

const PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Nova Scotia", "Ontario",
  "Prince Edward Island", "Quebec", "Saskatchewan",
];

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export const CustomerForm = ({
  country,
  setCountry,
  region,
  setRegion,
  phoneNumber,
  setPhoneNumber,
  profile,
  onFormChange
}: CustomerFormProps) => {
  // Pre-fill form with profile data when available
  useEffect(() => {
    console.log("Profile data received:", profile);
    if (profile) {
      if (profile.country) {
        console.log("Setting country:", profile.country);
        setCountry(profile.country);
      }
      if (profile.region) {
        console.log("Setting region:", profile.region);
        setRegion(profile.region);
      }
      if (profile.phone_number) {
        console.log("Setting phone number:", profile.phone_number);
        setPhoneNumber(profile.phone_number);
      }
    }
  }, [profile, setCountry, setRegion, setPhoneNumber]);

  const handleInputChange = async (field: string, value: string) => {
    console.log(`Updating ${field} with value:`, value);
    
    if (onFormChange) {
      onFormChange(field, value);
    }

    try {
      // Update profile in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            [field]: value,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error updating profile:', error);
          toast.error('Failed to update profile');
        } else {
          console.log(`Successfully updated ${field} in profile`);
        }
      }
    } catch (error) {
      console.error('Error in handleInputChange:', error);
      toast.error('Failed to update profile');
    }
  };

  // Split full name into first and last name
  const [firstName, lastName] = profile?.full_name?.split(' ') || ['', ''];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            defaultValue={firstName}
            onChange={(e) => {
              const newFirstName = e.target.value;
              const newFullName = `${newFirstName} ${lastName}`.trim();
              handleInputChange('full_name', newFullName);
            }}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            defaultValue={lastName}
            onChange={(e) => {
              const newLastName = e.target.value;
              const newFullName = `${firstName} ${newLastName}`.trim();
              handleInputChange('full_name', newFullName);
            }}
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          defaultValue={profile?.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            handleInputChange('phone_number', e.target.value);
          }}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select 
          value={country} 
          onValueChange={(value) => {
            setCountry(value);
            setRegion("");
            handleInputChange('country', value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {country && (
        <div className="space-y-2">
          <Label htmlFor="region">
            {country === "CA" ? "Province" : "State"}
          </Label>
          <Select 
            value={region} 
            onValueChange={(value) => {
              setRegion(value);
              handleInputChange('region', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${country === "CA" ? "province" : "state"}`} />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              {(country === "CA" ? PROVINCES : STATES).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          name="address" 
          defaultValue={profile?.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          required 
        />
      </div>
    </div>
  );
};