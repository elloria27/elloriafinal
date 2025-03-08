
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from "sonner";

interface PreferencesFormProps {
  language: string;
  setLanguage: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  address: string;
  country: string;
  region: string;
  user?: any;
}

export const PreferencesForm = ({
  language,
  setLanguage,
  currency,
  setCurrency,
  firstName,
  lastName,
  email,
  phoneNumber,
  address,
  country,
  region,
  user
}: PreferencesFormProps) => {
  // If user object is provided, use it to extract values not explicitly passed
  const effectiveFirstName = firstName || (user?.first_name || user?.firstName || '');
  const effectiveLastName = lastName || (user?.last_name || user?.lastName || '');
  const effectiveEmail = email || user?.email || null;
  const effectivePhoneNumber = phoneNumber || (user?.phone_number || user?.phoneNumber || '');
  const effectiveAddress = address || (user?.address || '');
  const effectiveCountry = country || (user?.country || '');
  const effectiveRegion = region || (user?.region || '');
  const effectiveLanguage = language || (user?.language || 'en');
  const effectiveCurrency = currency || (user?.currency || 'USD');

  const downloadProfilePDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Profile Information', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Full Name: ${effectiveFirstName} ${effectiveLastName}`, 20, 40);
      doc.text(`Email: ${effectiveEmail || 'Not provided'}`, 20, 50);
      doc.text(`Phone Number: ${effectivePhoneNumber || 'Not provided'}`, 20, 60);
      doc.text(`Address: ${effectiveAddress || 'Not provided'}`, 20, 70);
      doc.text(`Country: ${effectiveCountry || 'Not provided'}`, 20, 80);
      doc.text(`Region: ${effectiveRegion || 'Not provided'}`, 20, 90);
      doc.text(`Language: ${effectiveLanguage || 'Not provided'}`, 20, 100);
      doc.text(`Currency: ${effectiveCurrency || 'Not provided'}`, 20, 110);
      
      doc.save('profile-information.pdf');
      toast.success('Profile downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download profile');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={effectiveLanguage} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={effectiveCurrency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="CAD">CAD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button
          onClick={downloadProfilePDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Profile
        </Button>
      </div>
    </div>
  );
};
