import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  product: Product;
}

interface InventoryAdjustmentProps {
  inventory: InventoryItem[];
  onUpdate: () => void;
}

const REASON_TYPES = [
  { value: "RETAILER_SHIPMENT", label: "Shipped to Retailer" },
  { value: "NEW_STOCK", label: "New Stock Received" },
  { value: "DAMAGED", label: "Damaged Goods" },
  { value: "OTHER", label: "Other" },
];

export const InventoryAdjustment = ({ inventory, onUpdate }: InventoryAdjustmentProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [reasonType, setReasonType] = useState<string>("");
  const [retailerName, setRetailerName] = useState<string>("");
  const [reasonDetails, setReasonDetails] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !reasonType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting inventory adjustment...");
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const inventoryItem = inventory.find(item => item.product_id === selectedProduct);
      if (!inventoryItem) {
        toast.error("Selected product not found in inventory");
        return;
      }

      const newQuantity = inventoryItem.quantity + quantity;
      if (newQuantity < 0) {
        toast.error("Cannot reduce stock below 0");
        return;
      }

      console.log("Updating inventory quantity...");
      // Update inventory
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: newQuantity })
        .eq("product_id", selectedProduct);

      if (updateError) throw updateError;

      console.log("Creating inventory log...");
      // Log the adjustment
      const { error: logError } = await supabase
        .from("inventory_logs")
        .insert({
          product_id: selectedProduct,
          quantity_change: quantity,
          previous_quantity: inventoryItem.quantity,
          new_quantity: newQuantity,
          reason_type: reasonType,
          reason_details: reasonDetails,
          retailer_name: reasonType === "RETAILER_SHIPMENT" ? retailerName : null,
          created_by: user.id // Add the user ID here
        });

      if (logError) throw logError;

      console.log("Stock adjustment completed successfully");
      toast.success("Stock adjusted successfully");
      onUpdate();
      
      // Reset form
      setSelectedProduct("");
      setQuantity(0);
      setReasonType("");
      setRetailerName("");
      setReasonDetails("");
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast.error("Failed to adjust stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="product">Product</Label>
          <Select
            value={selectedProduct}
            onValueChange={setSelectedProduct}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {inventory.map((item) => (
                <SelectItem key={item.product_id} value={item.product_id}>
                  {item.product.name} (Current: {item.quantity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity Change</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Enter positive number to add, negative to subtract"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reasonType">Reason for Adjustment</Label>
          <Select
            value={reasonType}
            onValueChange={setReasonType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {REASON_TYPES.map((reason) => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {reasonType === "RETAILER_SHIPMENT" && (
          <div className="grid gap-2">
            <Label htmlFor="retailerName">Retailer Name</Label>
            <Input
              id="retailerName"
              value={retailerName}
              onChange={(e) => setRetailerName(e.target.value)}
              placeholder="e.g., Walmart, Costco"
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="reasonDetails">Additional Details</Label>
          <Textarea
            id="reasonDetails"
            value={reasonDetails}
            onChange={(e) => setReasonDetails(e.target.value)}
            placeholder="Enter any additional details about this adjustment"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Adjusting Stock..." : "Adjust Stock"}
      </Button>
    </form>
  );
};