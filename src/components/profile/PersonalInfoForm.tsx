
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email?: string | null;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  loading: boolean;
  user?: any;
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
  user
}: PersonalInfoFormProps) => {
  // Use values from user object if props are not provided
  const effectiveFirstName = firstName || (user?.first_name || user?.firstName || '');
  const effectiveLastName = lastName || (user?.last_name || user?.lastName || '');
  const effectiveEmail = email || user?.email || null;
  const effectivePhoneNumber = phoneNumber || (user?.phone_number || user?.phoneNumber || '');
  const effectiveAddress = address || (user?.address || '');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-800">Personal Information</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={effectiveFirstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={effectiveLastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={effectiveEmail || ''}
          disabled
          className="bg-gray-100"
        />
        <p className="text-sm text-gray-500">Email address cannot be changed</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          placeholder="Enter your phone number"
          value={effectivePhoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter your address"
          value={effectiveAddress}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
        />
      </div>
    </div>
  );
};
