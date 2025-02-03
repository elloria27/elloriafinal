import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  product: Product;
}

interface InventoryListProps {
  inventory: InventoryItem[];
  onRefresh: () => void;
}

export const InventoryList = ({ inventory, onRefresh }: InventoryListProps) => {
  const isMobile = useIsMobile();
  
  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= 0) return { label: "Out of Stock", color: "destructive" };
    if (quantity <= threshold) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Current Stock</h3>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {inventory.map((item) => {
            const status = getStockStatus(item.quantity, item.low_stock_threshold);
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 space-y-2"
              >
                <h4 className="font-medium text-sm">{item.product.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Low Stock Alert</p>
                    <p className="font-medium">{item.low_stock_threshold}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <Badge variant={status.color as "default" | "secondary" | "destructive" | "outline"}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Current Stock Levels</h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Low Stock Threshold</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => {
            const status = getStockStatus(item.quantity, item.low_stock_threshold);
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.product.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.low_stock_threshold}</TableCell>
                <TableCell>
                  <Badge variant={status.color as "default" | "secondary" | "destructive" | "outline"}>
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};