import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from "sonner";

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
  const downloadProfilePDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Profile Information', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Full Name: ${firstName} ${lastName}`, 20, 40);
      doc.text(`Email: ${email || 'Not provided'}`, 20, 50);
      doc.text(`Phone Number: ${phoneNumber || 'Not provided'}`, 20, 60);
      doc.text(`Address: ${address || 'Not provided'}`, 20, 70);
      doc.text(`Country: ${country || 'Not provided'}`, 20, 80);
      doc.text(`Region: ${region || 'Not provided'}`, 20, 90);
      doc.text(`Language: ${language || 'Not provided'}`, 20, 100);
      doc.text(`Currency: ${currency || 'Not provided'}`, 20, 110);
      
      doc.save('profile-information.pdf');
      toast.success('Profile downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download profile');
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
      <Button
        onClick={downloadProfilePDF}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Profile
      </Button>
    </div>
  );
};