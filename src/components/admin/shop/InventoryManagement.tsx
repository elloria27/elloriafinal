import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, AlertCircle, TrendingUp, TrendingDown, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryAdjustment } from "./InventoryAdjustment";
import { InventoryLogs } from "./InventoryLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  inventory?: {
    quantity: number;
    low_stock_threshold: number;
    sku?: string;
    location?: string;
    reorder_point?: number;
    optimal_stock?: number;
    unit_cost?: number;
    last_counted_at?: string;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
};

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please login to access this page");
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        const { data: roleData, error: roleError } = await supabase
          .rpc('is_admin', {
            user_id: user.id
          });

        if (roleError || !roleData) {
          console.error('Error checking admin role:', roleError);
          toast.error("Unauthorized access - Admin privileges required");
          return;
        }

        setIsAdmin(true);
        fetchProducts();
      } catch (error) {
        console.error('Admin access check failed:', error);
        toast.error("Error verifying admin access");
      }
    };

    checkAdminAccess();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("Fetching products with inventory data...");
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          inventory (
            quantity,
            low_stock_threshold,
            sku,
            location,
            reorder_point,
            optimal_stock,
            unit_cost,
            last_counted_at
          )
        `)
        .order('name');

      if (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
        return;
      }

      console.log("Products fetched:", data);
      
      const transformedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        inventory: product.inventory?.[0] || {
          quantity: 0,
          low_stock_threshold: 100,
          reorder_point: 50,
          optimal_stock: 200
        }
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    return products.reduce((total, product) => {
      const quantity = product.inventory?.quantity || 0;
      const unitCost = product.inventory?.unit_cost || 0;
      return total + (quantity * unitCost);
    }, 0);
  };

  const getLowStockCount = () => {
    return products.filter(product => 
      (product.inventory?.quantity || 0) <= (product.inventory?.reorder_point || 50)
    ).length;
  };

  const getOverStockCount = () => {
    return products.filter(product => 
      (product.inventory?.quantity || 0) > (product.inventory?.optimal_stock || 200)
    ).length;
  };

  const generatePDF = () => {
    try {
      console.log("Generating inventory PDF report...");
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text("Inventory Report", 105, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: "center" });
      
      // Add summary statistics
      doc.setFontSize(14);
      doc.text("Summary", 20, 40);
      doc.setFontSize(12);
      doc.text(`Total Inventory Value: ${formatCurrency(calculateTotalValue())}`, 20, 50);
      doc.text(`Low Stock Items: ${getLowStockCount()}`, 20, 60);
      doc.text(`Over Stock Items: ${getOverStockCount()}`, 20, 70);
      
      // Add inventory table
      const tableHeaders = ["Product", "SKU", "Location", "Stock", "Value"];
      const startY = 90;
      let currentY = startY;
      
      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(20, currentY - 5, 170, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.text("Product", 22, currentY);
      doc.text("SKU", 72, currentY);
      doc.text("Location", 102, currentY);
      doc.text("Stock", 142, currentY);
      doc.text("Value", 162, currentY);
      
      currentY += 10;
      doc.setFont("helvetica", "normal");

      // Table content
      products.forEach((product) => {
        const quantity = product.inventory?.quantity || 0;
        const unitCost = product.inventory?.unit_cost || 0;
        const totalValue = quantity * unitCost;
        
        // Check if we need a new page
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        
        // Wrap long product names
        const splitName = doc.splitTextToSize(product.name, 45);
        doc.text(splitName, 22, currentY);
        
        doc.text(product.inventory?.sku || "-", 72, currentY);
        doc.text(product.inventory?.location || "-", 102, currentY);
        doc.text(quantity.toString(), 142, currentY);
        doc.text(formatCurrency(totalValue), 162, currentY);
        
        currentY += splitName.length > 1 ? 20 : 10;
      });
      
      // Save the PDF
      doc.save("inventory-report.pdf");
      console.log("PDF generated successfully");
      toast.success("Inventory report downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate inventory report");
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Inventory Management</h2>
            <p className="text-muted-foreground">
              Manage product inventory levels and track stock movements
            </p>
          </div>
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(calculateTotalValue())}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLowStockCount()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Over Stock Items
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOverStockCount()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="w-full md:w-auto p-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="adjust">Stock Adjustment</TabsTrigger>
              <TabsTrigger value="logs">Movement Logs</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Reorder Point</TableHead>
                    <TableHead className="text-right">Optimal Stock</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const quantity = product.inventory?.quantity || 0;
                    const unitCost = product.inventory?.unit_cost || 0;
                    const totalValue = quantity * unitCost;
                    const reorderPoint = product.inventory?.reorder_point || 50;
                    const optimalStock = product.inventory?.optimal_stock || 200;

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="whitespace-nowrap">{product.name}</TableCell>
                        <TableCell>{product.inventory?.sku || '-'}</TableCell>
                        <TableCell>{product.inventory?.location || '-'}</TableCell>
                        <TableCell className="text-right">{quantity}</TableCell>
                        <TableCell className="text-right">{reorderPoint}</TableCell>
                        <TableCell className="text-right">{optimalStock}</TableCell>
                        <TableCell className="text-right">{formatCurrency(unitCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalValue)}</TableCell>
                        <TableCell className="text-right">
                          {quantity <= reorderPoint ? (
                            <div className="flex items-center justify-end gap-2 text-yellow-600">
                              <AlertCircle className="h-4 w-4" />
                              Low Stock
                            </div>
                          ) : quantity > optimalStock ? (
                            <div className="flex items-center justify-end gap-2 text-yellow-600">
                              <TrendingUp className="h-4 w-4" />
                              Over Stock
                            </div>
                          ) : (
                            <span className="text-green-600">Optimal</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="adjust">
            <InventoryAdjustment products={products} onUpdate={fetchProducts} />
          </TabsContent>

          <TabsContent value="logs">
            <InventoryLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};