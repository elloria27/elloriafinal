import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box, Package, ArrowUpDown, Search, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type InventoryItem = {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  sku: string;
  location: string;
  product: {
    name: string;
    image: string;
  };
};

type StockAdjustment = {
  productId: string;
  quantity: number;
  reason: string;
  retailerName?: string;
};

export const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [adjustment, setAdjustment] = useState<StockAdjustment>({
    productId: "",
    quantity: 0,
    reason: "",
    retailerName: "",
  });

  const fetchInventory = async () => {
    try {
      console.log("Fetching inventory...");
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          *,
          product:products (
            name,
            image
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inventory:", error);
        toast.error("Failed to fetch inventory");
        return;
      }

      console.log("Inventory fetched:", data);
      setInventory(data);
    } catch (error) {
      console.error("Error in fetchInventory:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockAdjustment = async () => {
    if (!selectedItem) return;

    try {
      console.log("Adjusting stock:", adjustment);
      
      // Update inventory
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ 
          quantity: selectedItem.quantity + adjustment.quantity 
        })
        .eq("id", selectedItem.id);

      if (updateError) throw updateError;

      // Log the adjustment
      const { error: logError } = await supabase
        .from("inventory_logs")
        .insert({
          product_id: selectedItem.product_id,
          quantity_change: adjustment.quantity,
          previous_quantity: selectedItem.quantity,
          new_quantity: selectedItem.quantity + adjustment.quantity,
          reason_type: adjustment.reason,
          retailer_name: adjustment.retailerName,
          adjustment_type: adjustment.quantity > 0 ? "increase" : "decrease"
        });

      if (logError) throw logError;

      toast.success("Stock adjusted successfully");
      setIsAdjustDialogOpen(false);
      fetchInventory();
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast.error("Failed to adjust stock");
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <Button onClick={() => {
          setSelectedItem(null);
          setIsAdjustDialogOpen(true);
        }}>
          <Box className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Current Stock</TabsTrigger>
          <TabsTrigger value="logs">Stock Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Search by name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Low Stock Alert</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {item.product.name}
                          </div>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.quantity <= (item.low_stock_threshold || 0) ? (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="mr-1 h-4 w-4" />
                              Low stock
                            </div>
                          ) : (
                            <span className="text-green-600">Above threshold</span>
                          )}
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsAdjustDialogOpen(true);
                            }}
                          >
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            Adjust Stock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Previous Stock</TableHead>
                      <TableHead>New Stock</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-02-04</TableCell>
                      <TableCell>Eco-Friendly Pads</TableCell>
                      <TableCell>Stock In</TableCell>
                      <TableCell>+50</TableCell>
                      <TableCell>100</TableCell>
                      <TableCell>150</TableCell>
                      <TableCell>Restock</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Adjust Stock Level" : "Add New Stock"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustment">Quantity Adjustment</Label>
              <Input
                id="adjustment"
                type="number"
                value={adjustment.quantity}
                onChange={(e) => setAdjustment(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 0
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Select 
                value={adjustment.reason}
                onValueChange={(value) => setAdjustment(prev => ({
                  ...prev,
                  reason: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">New Stock Received</SelectItem>
                  <SelectItem value="retailer_shipment">Shipped to Retailer</SelectItem>
                  <SelectItem value="damaged">Damaged Goods</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {adjustment.reason === "retailer_shipment" && (
              <div className="grid gap-2">
                <Label htmlFor="retailer">Retailer Name</Label>
                <Input
                  id="retailer"
                  value={adjustment.retailerName}
                  onChange={(e) => setAdjustment(prev => ({
                    ...prev,
                    retailerName: e.target.value
                  }))}
                  placeholder="e.g., Walmart, Costco"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStockAdjustment}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};