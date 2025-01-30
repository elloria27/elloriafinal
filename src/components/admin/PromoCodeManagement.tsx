import { useState, useEffect } from "react";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type PromoCode = {
  id: string;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed_amount';
  value: number;
  min_purchase_amount: number;
  max_uses: number | null;
  uses_count: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const defaultPromoCode: Partial<PromoCode> = {
  code: '',
  description: '',
  type: 'percentage',
  value: 0,
  min_purchase_amount: 0,
  max_uses: null,
  is_active: true,
  start_date: null,
  end_date: null,
};

export const PromoCodeManagement = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<Partial<PromoCode>>(defaultPromoCode);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPromoCodes = async () => {
    try {
      console.log("Fetching promo codes...");
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching promo codes:", error);
        toast.error("Failed to fetch promo codes");
        return;
      }

      console.log("Fetched promo codes:", data);
      setPromoCodes(data);
    } catch (error) {
      console.error("Error in fetchPromoCodes:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Submitting promo code:", editingPromoCode);
      
      if (!editingPromoCode.code || !editingPromoCode.type || !editingPromoCode.value) {
        toast.error("Please fill in all required fields");
        return;
      }

      const { data, error } = isEditing
        ? await supabase
            .from("promo_codes")
            .update({
              code: editingPromoCode.code,
              description: editingPromoCode.description,
              type: editingPromoCode.type,
              value: editingPromoCode.value,
              min_purchase_amount: editingPromoCode.min_purchase_amount,
              max_uses: editingPromoCode.max_uses,
              start_date: editingPromoCode.start_date,
              end_date: editingPromoCode.end_date,
              is_active: editingPromoCode.is_active,
            })
            .eq("id", editingPromoCode.id)
            .select()
            .single()
        : await supabase
            .from("promo_codes")
            .insert({
              code: editingPromoCode.code,
              description: editingPromoCode.description,
              type: editingPromoCode.type,
              value: editingPromoCode.value,
              min_purchase_amount: editingPromoCode.min_purchase_amount,
              max_uses: editingPromoCode.max_uses,
              start_date: editingPromoCode.start_date,
              end_date: editingPromoCode.end_date,
              is_active: editingPromoCode.is_active,
            })
            .select()
            .single();

      if (error) {
        console.error("Error saving promo code:", error);
        toast.error(error.message);
        return;
      }

      console.log("Promo code saved successfully:", data);
      await fetchPromoCodes();
      setIsDialogOpen(false);
      setEditingPromoCode(defaultPromoCode);
      toast.success(isEditing ? "Promo code updated successfully" : "Promo code created successfully");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting promo code:", id);
      
      const { error } = await supabase
        .from("promo_codes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting promo code:", error);
        toast.error("Failed to delete promo code");
        return;
      }

      await fetchPromoCodes();
      toast.success("Promo code deleted successfully");
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP");
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading promo codes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Promo Code Management</h2>
        <Button
          onClick={() => {
            setIsEditing(false);
            setEditingPromoCode(defaultPromoCode);
            setIsDialogOpen(true);
          }}
        >
          Create Promo Code
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Uses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodes.map((promoCode) => (
            <TableRow key={promoCode.id}>
              <TableCell className="font-medium">{promoCode.code}</TableCell>
              <TableCell>
                {promoCode.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
              </TableCell>
              <TableCell>
                {promoCode.type === 'percentage' 
                  ? `${promoCode.value}%` 
                  : `$${promoCode.value.toFixed(2)}`}
              </TableCell>
              <TableCell>
                {promoCode.uses_count}
                {promoCode.max_uses ? ` / ${promoCode.max_uses}` : ''}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  promoCode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {promoCode.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>{formatDate(promoCode.end_date)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      setEditingPromoCode(promoCode);
                      setIsDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(promoCode.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edit the details of your promo code below.' 
                : 'Create a new promo code by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={editingPromoCode.code}
                onChange={(e) => setEditingPromoCode(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter promo code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingPromoCode.description || ''}
                onChange={(e) => setEditingPromoCode(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={editingPromoCode.type}
                  onValueChange={(value: 'percentage' | 'fixed_amount') => 
                    setEditingPromoCode(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={editingPromoCode.value}
                  onChange={(e) => setEditingPromoCode(prev => ({ 
                    ...prev, 
                    value: parseFloat(e.target.value) 
                  }))}
                  placeholder={editingPromoCode.type === 'percentage' ? "Enter %" : "Enter amount"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_purchase">Minimum Purchase</Label>
                <Input
                  id="min_purchase"
                  type="number"
                  value={editingPromoCode.min_purchase_amount}
                  onChange={(e) => setEditingPromoCode(prev => ({ 
                    ...prev, 
                    min_purchase_amount: parseFloat(e.target.value) 
                  }))}
                  placeholder="Enter minimum amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_uses">Maximum Uses</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={editingPromoCode.max_uses || ''}
                  onChange={(e) => setEditingPromoCode(prev => ({ 
                    ...prev, 
                    max_uses: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  placeholder="Enter max uses"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={editingPromoCode.start_date?.slice(0, 16) || ''}
                  onChange={(e) => setEditingPromoCode(prev => ({ 
                    ...prev, 
                    start_date: e.target.value ? new Date(e.target.value).toISOString() : null 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={editingPromoCode.end_date?.slice(0, 16) || ''}
                  onChange={(e) => setEditingPromoCode(prev => ({ 
                    ...prev, 
                    end_date: e.target.value ? new Date(e.target.value).toISOString() : null 
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editingPromoCode.is_active}
                onCheckedChange={(checked) => 
                  setEditingPromoCode(prev => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <DialogFooter>
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'} Promo Code
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};