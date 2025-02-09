
import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptText } from "lucide-react";

const InvoiceManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Invoice Management</h1>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">All Invoices</h3>
            </CardHeader>
            <CardContent>
              {/* Invoice table will be implemented here */}
              <p className="text-muted-foreground">No invoices found.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Pending Invoices</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No pending invoices found.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Paid Invoices</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No paid invoices found.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Overdue Invoices</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No overdue invoices found.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceManagement;
