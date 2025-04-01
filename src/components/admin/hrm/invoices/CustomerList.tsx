
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CustomerForm from "./CustomerForm";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  tax_id: string | null;
  address: {
    street?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country?: string;
  } | null;
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("hrm_customers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setCustomers(data as Customer[]);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      // Check if customer is used in invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from("hrm_invoices")
        .select("id")
        .eq("customer_id", customerId)
        .limit(1);

      if (invoicesError) throw invoicesError;

      if (invoices && invoices.length > 0) {
        toast.error("Cannot delete customer with associated invoices");
        return;
      }

      const { error } = await supabase
        .from("hrm_customers")
        .delete()
        .eq("id", customerId);

      if (error) throw error;

      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    }
    setShowDeleteDialog(false);
    setCustomerToDelete(null);
  };

  const renderMobileCustomerCard = (customer: Customer) => {
    return (
      <div key={customer.id} className="border rounded-md p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{customer.name}</h3>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <User size={20} className="text-muted-foreground" />
        </div>
        
        {customer.phone && <p className="text-sm mb-1">Phone: {customer.phone}</p>}
        {customer.tax_id && <p className="text-sm mb-1">Tax ID: {customer.tax_id}</p>}
        
        {customer.address && (
          <div className="mt-2 text-sm">
            <p className="font-medium text-xs text-muted-foreground mb-1">Address:</p>
            {customer.address.street && <p>{customer.address.street}</p>}
            <p>
              {customer.address.city && `${customer.address.city}, `}
              {customer.address.province}
            </p>
            <p>
              {customer.address.postal_code && `${customer.address.postal_code}, `}
              {customer.address.country}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCustomerId(customer.id);
              setShowEditDialog(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCustomerToDelete(customer.id);
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Customers</h3>
        <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className={`${isMobile ? "w-[95%] p-4" : "max-w-3xl"}`}>
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSuccess={() => {
                setShowNewCustomerDialog(false);
                fetchCustomers();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          No customers found
        </div>
      ) : isMobile ? (
        // Mobile view - cards
        <div className="space-y-4">
          {customers.map((customer) => renderMobileCustomerCard(customer))}
        </div>
      ) : (
        // Desktop view - table
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tax ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>{customer.tax_id || "-"}</TableCell>
                  <TableCell>
                    {customer.address ? (
                      <>
                        {customer.address.street && <div>{customer.address.street}</div>}
                        {customer.address.city && customer.address.province && (
                          <div>
                            {customer.address.city}, {customer.address.province}
                          </div>
                        )}
                        {customer.address.postal_code && customer.address.country && (
                          <div>
                            {customer.address.postal_code}, {customer.address.country}
                          </div>
                        )}
                        {!customer.address.street && 
                         !customer.address.city && 
                         !customer.address.province && 
                         !customer.address.postal_code && 
                         !customer.address.country && "-"}
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomerId(customer.id);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCustomerToDelete(customer.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className={`${isMobile ? "w-[95%] p-4" : "max-w-3xl"}`}>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomerId && (
            <CustomerForm
              customerId={selectedCustomerId}
              onSuccess={() => {
                setShowEditDialog(false);
                fetchCustomers();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer and may affect associated records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => customerToDelete && handleDeleteCustomer(customerToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerList;
