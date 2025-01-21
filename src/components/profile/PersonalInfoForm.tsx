import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface PersonalInfoFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string | null;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  loading: boolean;
  onFormChange?: (field: string, value: string) => void;
}

export const PersonalInfoForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  loading,
  onFormChange
}: PersonalInfoFormProps) => {
  const handleInputChange = (field: string, value: string) => {
    console.log(`Handling input change for ${field}:`, value);
    
    if (onFormChange) {
      onFormChange(field, value);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            const newFirstName = e.target.value;
            const newFullName = `${newFirstName} ${lastName}`.trim();
            handleInputChange('full_name', newFullName);
          }}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            const newLastName = e.target.value;
            const newFullName = `${firstName} ${newLastName}`.trim();
            handleInputChange('full_name', newFullName);
          }}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email || ''}
          disabled
          className="bg-gray-50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            handleInputChange('phone_number', e.target.value);
          }}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            handleInputChange('address', e.target.value);
          }}
          disabled={loading}
        />
      </div>
    </div>
  );
};