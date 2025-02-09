
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceList from "./InvoiceList";
import InvoiceDashboard from "./InvoiceDashboard";
import CustomerList from "./CustomerList";
import RecurringInvoices from "./RecurringInvoices";
import Estimates from "./Estimates";
import CreditNotes from "./CreditNotes";
import InvoiceSettings from "./InvoiceSettings";

const InvoiceManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Invoice Management</h2>
        <p className="text-muted-foreground">
          Manage invoices, estimates, recurring billing, and more
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
          <TabsTrigger value="credit-notes">Credit Notes</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <InvoiceDashboard />
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceList />
        </TabsContent>
        
        <TabsContent value="recurring" className="space-y-4">
          <RecurringInvoices />
        </TabsContent>
        
        <TabsContent value="estimates" className="space-y-4">
          <Estimates />
        </TabsContent>
        
        <TabsContent value="credit-notes" className="space-y-4">
          <CreditNotes />
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
