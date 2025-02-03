import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
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

interface Product {
  id: string;
  name: string;
  inventory?: {
    quantity: number;
    low_stock_threshold: number;
  };
}

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please login to access this page");
          navigate("/login");
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .rpc('is_admin', {
            user_id: user.id
          });

        if (roleError || !roleData) {
          console.error('Error checking admin role:', roleError);
          toast.error("Unauthorized access - Admin privileges required");
          navigate("/");
          return;
        }

        setIsAdmin(true);
        fetchProducts();
      } catch (error) {
        console.error('Admin access check failed:', error);
        toast.error("Error verifying admin access");
        navigate("/");
      }
    };

    checkAdminAccess();
  }, [navigate]);

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
            low_stock_threshold
          )
        `)
        .order('name');

      if (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
        return;
      }

      console.log("Products fetched:", data);
      setProducts(data || []);
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <p className="text-muted-foreground">
          Manage product inventory levels and track stock movements
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="adjust">Stock Adjustment</TabsTrigger>
          <TabsTrigger value="logs">Movement Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Low Stock Alert</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-right">
                      {product.inventory?.quantity || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.inventory?.low_stock_threshold || 100}
                    </TableCell>
                    <TableCell className="text-right">
                      {(product.inventory?.quantity || 0) <= (product.inventory?.low_stock_threshold || 100) ? (
                        <div className="flex items-center justify-end gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          Low Stock
                        </div>
                      ) : (
                        <span className="text-green-600">In Stock</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
  );
};