import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
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
  const [email, setEmail] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
      if (profile.email) {
        console.log("Setting email:", profile.email);
        setEmail(profile.email);
      }
      if (profile.full_name) {
        const [first, last] = profile.full_name.split(' ');
        setFirstName(first || '');
        setLastName(last || '');
      }
    }
  }, [profile, setCountry, setRegion, setPhoneNumber]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        console.log("Setting email from session:", session.user.email);
        setEmail(session.user.email);
        setIsAuthenticated(true);
      }
    };
    getSession();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    if (validateEmail(email)) {
      handleInputChange('email', email);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Handling input change for ${field}:`, value);
    
    if (onFormChange) {
      onFormChange(field, value);
    }
  };

  const handleNameChange = (type: 'first' | 'last', value: string) => {
    if (type === 'first') {
      setFirstName(value);
    } else {
      setLastName(value);
    }
    
    const newFullName = type === 'first' 
      ? `${value} ${lastName}`.trim()
      : `${firstName} ${value}`.trim();
      
    handleInputChange('full_name', newFullName);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            value={firstName}
            onChange={(e) => handleNameChange('first', e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={lastName}
            onChange={(e) => handleNameChange('last', e.target.value)}
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
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          readOnly={isAuthenticated}
          required 
          className={emailError ? "border-red-500" : ""}
        />
        {emailError && (
          <p className="text-sm text-red-500 mt-1">{emailError}</p>
        )}
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