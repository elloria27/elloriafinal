import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  address: string;
  country: string;
  region: string;
  language: string;
  currency: string;
}

export const ProfileHeader = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  address,
  country,
  region,
  language,
  currency
}: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
    </div>
  );
};