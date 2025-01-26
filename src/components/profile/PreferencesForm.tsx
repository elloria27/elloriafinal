import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreferencesFormProps {
  language: string;
  setLanguage: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

export const PreferencesForm = ({
  language,
  setLanguage,
  currency,
  setCurrency,
}: PreferencesFormProps) => {
  return (
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
  );
};