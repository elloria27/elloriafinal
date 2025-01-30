import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  base_price: number;
  estimated_days: string;
  regions: string[];
}

export const DeliveryMethodManagement = () => {
  const [methods, setMethods] = useState<DeliveryMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod | null>(null);

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  const fetchDeliveryMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .order('name');

      if (error) throw error;
      setMethods(data || []);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
      toast.error("Failed to load delivery methods");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const methodData = {
        name: formData.get('name')?.toString() || '',
        description: formData.get('description')?.toString() || '',
        is_active: formData.get('is_active') === 'on',
        base_price: parseFloat(formData.get('base_price')?.toString() || '0'),
        estimated_days: formData.get('estimated_days')?.toString() || '',
        regions: (formData.get('regions')?.toString() || '').split(',').map(r => r.trim()),
      };

      if (selectedMethod) {
        const { error } = await supabase
          .from('delivery_methods')
          .update(methodData)
          .eq('id', selectedMethod.id);

        if (error) throw error;
        toast.success("Delivery method updated successfully");
      } else {
        const { error } = await supabase
          .from('delivery_methods')
          .insert([methodData]);

        if (error) throw error;
        toast.success("Delivery method created successfully");
      }

      setIsDialogOpen(false);
      fetchDeliveryMethods();
    } catch (error) {
      console.error('Error saving delivery method:', error);
      toast.error("Failed to save delivery method");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery method?")) return;

    try {
      const { error } = await supabase
        .from('delivery_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Delivery method deleted successfully");
      fetchDeliveryMethods();
    } catch (error) {
      console.error('Error deleting delivery method:', error);
      toast.error("Failed to delete delivery method");
    }
  };

  if (loading) {
    return <div>Loading delivery methods...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Methods</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedMethod(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Delivery Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMethod ? "Edit Delivery Method" : "Add Delivery Method"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedMethod?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={selectedMethod?.description}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price</Label>
                <Input
                  id="base_price"
                  name="base_price"
                  type="number"
                  step="0.01"
                  defaultValue={selectedMethod?.base_price}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_days">Estimated Days</Label>
                <Input
                  id="estimated_days"
                  name="estimated_days"
                  defaultValue={selectedMethod?.estimated_days}
                  placeholder="e.g. 2-3 business days"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regions">Regions (comma-separated)</Label>
                <Input
                  id="regions"
                  name="regions"
                  defaultValue={selectedMethod?.regions.join(', ')}
                  placeholder="e.g. US, CA, EU"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={selectedMethod?.is_active}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button type="submit" className="w-full">
                {selectedMethod ? "Update" : "Create"} Delivery Method
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Estimated Days</TableHead>
            <TableHead>Regions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {methods.map((method) => (
            <TableRow key={method.id}>
              <TableCell>{method.name}</TableCell>
              <TableCell>{method.description}</TableCell>
              <TableCell>${method.base_price}</TableCell>
              <TableCell>{method.estimated_days}</TableCell>
              <TableCell>{method.regions.join(', ')}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-sm ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {method.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMethod(method);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};