
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    tax_id?: string | null;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      postal_code?: string;
      country?: string;
    };
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CustomerForm = ({ customer, onSuccess, onCancel }: CustomerFormProps) => {
  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [taxId, setTaxId] = useState(customer?.tax_id || "");
  const [street, setStreet] = useState(customer?.address?.street || "");
  const [city, setCity] = useState(customer?.address?.city || "");
  const [province, setProvince] = useState(customer?.address?.province || "");
  const [postalCode, setPostalCode] = useState(customer?.address?.postal_code || "");
  const [country, setCountry] = useState(customer?.address?.country || "Canada");
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!name.trim() || !email.trim()) {
        toast.error("Name and email are required");
        return;
      }

      const customerData = {
        name,
        email,
        phone: phone || null,
        tax_id: taxId || null,
        address: {
          street,
          city,
          province,
          postal_code: postalCode,
          country
        }
      };

      if (customer?.id) {
        // Update existing customer
        const { error } = await supabase
          .from("hrm_customers")
          .update(customerData)
          .eq("id", customer.id);

        if (error) throw error;
        toast.success("Customer updated successfully");
      } else {
        // Create new customer
        const { error } = await supabase
          .from("hrm_customers")
          .insert([customerData]);

        if (error) throw error;
        toast.success("Customer created successfully");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer or Company Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(123) 456-7890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxId">Tax ID</Label>
        <Input
          id="taxId"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder="Tax ID or Business Number"
        />
      </div>
      
      <div className="pt-2">
        <h3 className="text-sm font-medium mb-3">Address</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="province">Province/State</Label>
              <Input
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Province or State"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal/ZIP Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal or ZIP Code"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin mr-2">⊚</span>
              Saving...
            </>
          ) : customer?.id ? (
            "Update Customer"
          ) : (
            "Create Customer"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
