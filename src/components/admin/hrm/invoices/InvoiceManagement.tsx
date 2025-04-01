
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceList from "./InvoiceList";
import InvoiceDashboard from "./InvoiceDashboard";
import CustomerList from "./CustomerList";
import InvoiceSettings from "./InvoiceSettings";
import { useIsMobile } from "@/hooks/use-mobile";

const InvoiceManagement = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold tracking-tight`}>Invoice Management</h2>
          <p className="text-muted-foreground">
            Manage invoices, customers, and billing settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
          <TabsList className={`${isMobile ? 'w-full' : ''}`}>
            <TabsTrigger value="dashboard" className={isMobile ? 'text-xs px-2 py-1.5 flex-1' : ''}>Dashboard</TabsTrigger>
            <TabsTrigger value="invoices" className={isMobile ? 'text-xs px-2 py-1.5 flex-1' : ''}>Invoices</TabsTrigger>
            <TabsTrigger value="customers" className={isMobile ? 'text-xs px-2 py-1.5 flex-1' : ''}>Customers</TabsTrigger>
            <TabsTrigger value="settings" className={isMobile ? 'text-xs px-2 py-1.5 flex-1' : ''}>Settings</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dashboard" className="space-y-4">
          <InvoiceDashboard />
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceList />
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <CustomerList />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <InvoiceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceManagement;
