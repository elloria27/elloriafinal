import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Box, Package, ArrowUpDown, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <Button>
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
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Eco-Friendly Pads
                      </div>
                    </TableCell>
                    <TableCell>ECO-PAD-001</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>
                      <span className="text-green-600">Above threshold</span>
                    </TableCell>
                    <TableCell>Warehouse A</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Adjust Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};