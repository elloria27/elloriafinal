import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  name: string;
  inventory?: {
    quantity: number;
    low_stock_threshold: number;
    sku?: string;
    location?: string;
    unit_cost?: number;
  };
}

interface InventoryAdjustmentProps {
  products: Product[];
  onUpdate: () => void;
}

export const InventoryAdjustment = ({ products, onUpdate }: InventoryAdjustmentProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [reasonType, setReasonType] = useState<string>("");
  const [retailerName, setRetailerName] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [unitCost, setUnitCost] = useState<number>(0);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAdjustment = async () => {
    if (!selectedProduct || !quantity || !reasonType) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting inventory adjustment...");

      const product = products.find(p => p.id === selectedProduct);
      if (!product) {
        throw new Error("Product not found");
      }

      const currentQuantity = product.inventory?.quantity || 0;
      const newQuantity = currentQuantity + quantity;

      if (newQuantity < 0) {
        toast.error("Cannot reduce stock below 0");
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Calculate total cost
      const totalCost = quantity * unitCost;

      // Update inventory
      const { error: inventoryError } = await supabase
        .from('inventory')
        .upsert({
          product_id: selectedProduct,
          quantity: newQuantity,
          location: location || product.inventory?.location,
          unit_cost: unitCost || product.inventory?.unit_cost,
          last_counted_at: reasonType === 'stock_count' ? new Date().toISOString() : undefined
        });

      if (inventoryError) throw inventoryError;

      // Log the adjustment
      const { error: logError } = await supabase
        .from('inventory_logs')
        .insert({
          product_id: selectedProduct,
          quantity_change: quantity,
          previous_quantity: currentQuantity,
          new_quantity: newQuantity,
          reason_type: reasonType,
          reason_details: details,
          retailer_name: reasonType === 'retailer_shipment' ? retailerName : null,
          location: location,
          unit_cost: unitCost,
          total_cost: totalCost,
          reference_number: referenceNumber,
          performed_by: user.email,
          created_by: user.id
        });

      if (logError) throw logError;

      console.log("Inventory adjustment completed successfully");
      toast.success("Inventory updated successfully");
      onUpdate();

      // Reset form
      setQuantity(0);
      setReasonType("");
      setRetailerName("");
      setDetails("");
      setLocation("");
      setUnitCost(0);
      setReferenceNumber("");
    } catch (error) {
      console.error("Error adjusting inventory:", error);
      toast.error("Failed to update inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjust Stock Level</CardTitle>
        <CardDescription>
          Manually adjust product stock levels and record the reason for the change
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Current: {product.inventory?.quantity || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Change</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity (negative for reduction)"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Adjustment</Label>
            <Select
              value={reasonType}
              onValueChange={setReasonType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retailer_shipment">Shipped to Retailer</SelectItem>
                <SelectItem value="new_stock">New Stock Received</SelectItem>
                <SelectItem value="damaged">Damaged Goods</SelectItem>
                <SelectItem value="stock_count">Stock Count Adjustment</SelectItem>
                <SelectItem value="return">Customer Return</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter storage location"
            />
          </div>
        </div>

        {reasonType === 'retailer_shipment' && (
          <div className="space-y-2">
            <Label htmlFor="retailer">Retailer Name</Label>
            <Input
              id="retailer"
              value={retailerName}
              onChange={(e) => setRetailerName(e.target.value)}
              placeholder="Enter retailer name (e.g., Walmart, Costco)"
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="unitCost">Unit Cost</Label>
            <Input
              id="unitCost"
              type="number"
              step="0.01"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              placeholder="Enter unit cost"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference number (optional)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="details">Additional Details</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter any additional details about this adjustment"
            className="min-h-[100px]"
          />
        </div>

        <Button 
          onClick={handleAdjustment} 
          disabled={loading || !selectedProduct || !quantity || !reasonType}
          className="w-full md:w-auto"
        >
          {loading ? "Processing..." : "Update Stock"}
        </Button>
      </CardContent>
    </Card>
  );
};