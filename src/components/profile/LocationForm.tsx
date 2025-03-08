
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CANADIAN_TAX_RATES, US_TAX_RATES } from "@/utils/locationData";

// Create a list of countries for the dropdown
const countries = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" }
];

interface LocationFormProps {
  country: string;
  setCountry: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  user?: any;
}

export const LocationForm = ({
  country,
  setCountry,
  region,
  setRegion,
  user
}: LocationFormProps) => {
  // Use values from user object if props are not provided
  const effectiveCountry = country || (user?.country || '');
  const effectiveRegion = region || (user?.region || '');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-800">Location</h2>
      
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={effectiveCountry} onValueChange={setCountry}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="region">State / Province / Region</Label>
        <Input
          id="region"
          placeholder="Enter your state, province, or region"
          value={effectiveRegion}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>
    </div>
  );
};
