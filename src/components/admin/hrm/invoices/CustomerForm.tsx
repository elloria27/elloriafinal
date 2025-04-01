
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerFormProps {
  customerId?: string;
  onSuccess?: () => void;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  taxId?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country?: string;
  };
}

const CustomerForm = ({ customerId, onSuccess }: CustomerFormProps) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    taxId: "",
    address: {
      street: "",
      city: "",
      province: "",
      postal_code: "",
      country: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("hrm_customers")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;

      // Convert database address format to our form's address format
      const customerData: CustomerFormData = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        taxId: data.tax_id || "",
        // Handle address which might be a string, object, or null
        address: {
          street: "",
          city: "",
          province: "",
          postal_code: "",
          country: ""
        }
      };

      // Parse the address object if it exists
      if (data.address && typeof data.address === 'object') {
        customerData.address = {
          street: data.address.street || "",
          city: data.address.city || "",
          province: data.address.province || "",
          postal_code: data.address.postal_code || "",
          country: data.address.country || ""
        };
      }
      
      setFormData(customerData);
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to load customer data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;

      // Prepare data for submission
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        tax_id: formData.taxId || null,
        address: formData.address || null
      };

      if (customerId) {
        // Update
        result = await supabase
          .from("hrm_customers")
          .update(dataToSubmit)
          .eq("id", customerId);
      } else {
        // Create
        result = await supabase
          .from("hrm_customers")
          .insert(dataToSubmit);
      }

      if (result.error) throw result.error;

      toast.success(customerId ? "Customer updated successfully" : "Customer created successfully");
      
      if (onSuccess) {
        onSuccess();
      }

      if (!customerId) {
        // Reset form after successful creation
        setFormData({
          name: "",
          email: "",
          phone: "",
          taxId: "",
          address: {
            street: "",
            city: "",
            province: "",
            postal_code: "",
            country: ""
          }
        });
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customerId) return;
    
    if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      return;
    }

    setLoading(true);

    try {
      // Check if customer has invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from("hrm_invoices")
        .select("id")
        .eq("customer_id", customerId)
        .limit(1);

      if (invoicesError) throw invoicesError;

      if (invoices && invoices.length > 0) {
        toast.error("Cannot delete customer: Customer has invoices associated with them");
        return;
      }

      // Delete customer
      const { error } = await supabase
        .from("hrm_customers")
        .delete()
        .eq("id", customerId);

      if (error) throw error;

      toast.success("Customer deleted successfully");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Customer Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className={isMobile ? "text-sm" : ""}
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className={isMobile ? "text-sm" : ""}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          className={isMobile ? "text-sm" : ""}
        />
      </div>

      <div>
        <Label htmlFor="tax_id">Tax ID</Label>
        <Input
          id="tax_id"
          name="taxId"
          value={formData.taxId || ""}
          onChange={handleInputChange}
          className={isMobile ? "text-sm" : ""}
        />
      </div>

      <div className="pt-2">
        <h3 className="text-md font-medium mb-2">Address Details</h3>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              name="address.street"
              value={formData.address?.street || ""}
              onChange={handleInputChange}
              className={isMobile ? "text-sm" : ""}
            />
          </div>
          
          <div className={isMobile ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 gap-3"}>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="address.city"
                value={formData.address?.city || ""}
                onChange={handleInputChange}
                className={isMobile ? "text-sm" : ""}
              />
            </div>
            
            <div>
              <Label htmlFor="province">Province/State</Label>
              <Input
                id="province"
                name="address.province"
                value={formData.address?.province || ""}
                onChange={handleInputChange}
                className={isMobile ? "text-sm" : ""}
              />
            </div>
          </div>
          
          <div className={isMobile ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 gap-3"}>
            <div>
              <Label htmlFor="postal_code">Postal/ZIP Code</Label>
              <Input
                id="postal_code"
                name="address.postal_code"
                value={formData.address?.postal_code || ""}
                onChange={handleInputChange}
                className={isMobile ? "text-sm" : ""}
              />
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="address.country"
                value={formData.address?.country || ""}
                onChange={handleInputChange}
                className={isMobile ? "text-sm" : ""}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`flex ${isMobile ? "flex-col" : ""} gap-2 justify-between pt-4`}>
        <Button type="submit" disabled={loading} className={isMobile ? "w-full" : ""}>
          {loading ? "Saving..." : customerId ? "Update Customer" : "Create Customer"}
        </Button>

        {customerId && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
            className={isMobile ? "w-full mt-2" : ""}
          >
            Delete Customer
          </Button>
        )}
      </div>
    </form>
  );
};

export default CustomerForm;
