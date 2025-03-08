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
}: PreferencesFormProps) => {
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
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
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
          <Select value={currency} onValueChange={setCurrency}>
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