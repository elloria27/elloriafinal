
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect } from "react";

export const InvoiceManagement = () => {
  useEffect(() => {
    console.log("InvoiceManagement component mounted");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Invoice Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <Card className="p-6">
        <div className="min-h-[200px] flex items-center justify-center text-gray-500">
          No invoices found. Click "New Invoice" to create one.
        </div>
      </Card>
    </div>
  );
};

