
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phoneNumber?: string;
  address?: string;
  country?: string;
  region?: string;
  language?: string;
  currency?: string;
  user?: any;
  showSettings?: boolean;
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
  currency,
  user,
  showSettings
}: ProfileHeaderProps) => {
  // If a user object is passed, extract properties from it
  const userFirstName = firstName || (user?.first_name || user?.firstName || '');
  const userLastName = lastName || (user?.last_name || user?.lastName || '');
  const userEmail = email || user?.email || null;

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        {showSettings ? 'Profile Settings' : 'Profile'}
      </h1>
      {userFirstName && userLastName && (
        <div className="text-gray-600">
          {userFirstName} {userLastName}
          {userEmail && <div className="text-sm">{userEmail}</div>}
        </div>
      )}
    </div>
  );
};
