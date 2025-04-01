
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
      <div>
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold tracking-tight`}>Invoice Management</h2>
        <p className="text-muted-foreground">
          Manage invoices, customers, and billing settings
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className={`flex-wrap ${isMobile ? 'w-full grid grid-cols-2 gap-1' : ''}`}>
          <TabsTrigger value="dashboard" className={isMobile ? 'w-full text-xs py-1.5' : ''}>Dashboard</TabsTrigger>
          <TabsTrigger value="invoices" className={isMobile ? 'w-full text-xs py-1.5' : ''}>Invoices</TabsTrigger>
          <TabsTrigger value="customers" className={isMobile ? 'w-full text-xs py-1.5' : ''}>Customers</TabsTrigger>
          <TabsTrigger value="settings" className={isMobile ? 'w-full text-xs py-1.5' : ''}>Settings</TabsTrigger>
        </TabsList>
        
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
