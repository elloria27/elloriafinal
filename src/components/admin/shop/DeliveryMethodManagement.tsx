import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeliveryMethod {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  base_price: number;
  estimated_days: string | null;
  regions: string[];
}

const AVAILABLE_REGIONS = {
  CA: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan"
  ],
  US: [
    "California",
    "New York",
    "Texas",
    // Add more states as needed
  ]
};

export const DeliveryMethodManagement = () => {
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<DeliveryMethod | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
    base_price: 0,
    estimated_days: "",
    regions: [] as string[]
  });

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  const fetchDeliveryMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveryMethods(data || []);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
      toast.error('Failed to load delivery methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const methodData = {
        ...formData,
        base_price: Number(formData.base_price)
      };

      let error;
      if (editingMethod) {
        const { error: updateError } = await supabase
          .from('delivery_methods')
          .update(methodData)
          .eq('id', editingMethod.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('delivery_methods')
          .insert([methodData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(
        editingMethod 
          ? 'Delivery method updated successfully' 
          : 'Delivery method added successfully'
      );
      
      setIsDialogOpen(false);
      fetchDeliveryMethods();
      resetForm();
    } catch (error) {
      console.error('Error saving delivery method:', error);
      toast.error('Failed to save delivery method');
    }
  };

  const handleEdit = (method: DeliveryMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      description: method.description || "",
      is_active: method.is_active,
      base_price: method.base_price,
      estimated_days: method.estimated_days || "",
      regions: method.regions || []
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMethod(null);
    setFormData({
      name: "",
      description: "",
      is_active: true,
      base_price: 0,
      estimated_days: "",
      regions: []
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Methods</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Add Delivery Method</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'Edit Delivery Method' : 'Add Delivery Method'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_days">Estimated Days</Label>
                <Input
                  id="estimated_days"
                  value={formData.estimated_days}
                  onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
                  placeholder="e.g., 2-3 business days"
                />
              </div>

              <div className="space-y-2">
                <Label>Regions</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Canada</h4>
                    {AVAILABLE_REGIONS.CA.map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`region-${region}`}
                          checked={formData.regions.includes(region)}
                          onChange={(e) => {
                            const newRegions = e.target.checked
                              ? [...formData.regions, region]
                              : formData.regions.filter(r => r !== region);
                            setFormData({ ...formData, regions: newRegions });
                          }}
                        />
                        <Label htmlFor={`region-${region}`}>{region}</Label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">United States</h4>
                    {AVAILABLE_REGIONS.US.map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`region-${region}`}
                          checked={formData.regions.includes(region)}
                          onChange={(e) => {
                            const newRegions = e.target.checked
                              ? [...formData.regions, region]
                              : formData.regions.filter(r => r !== region);
                            setFormData({ ...formData, regions: newRegions });
                          }}
                        />
                        <Label htmlFor={`region-${region}`}>{region}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMethod ? 'Update' : 'Add'} Delivery Method
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {deliveryMethods.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No delivery methods found
          </div>
        ) : (
          <div className="divide-y">
            {deliveryMethods.map((method) => (
              <div key={method.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-full ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {method.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-600">
                        Base Price: ${method.base_price}
                      </span>
                      {method.estimated_days && (
                        <span className="text-gray-600">
                          Estimated Days: {method.estimated_days}
                        </span>
                      )}
                    </div>
                    {method.regions && method.regions.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          Available in: {method.regions.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(method)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};