import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const PaymentMethodManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [stripeConfig, setStripeConfig] = useState({
    publishable_key: "",
    secret_key: "",
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method) => {
    setEditingId(method.id);
    setStripeConfig(method.stripe_config || { publishable_key: "", secret_key: "" });
  };

  const handleSave = async (methodId) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          stripe_config: stripeConfig
        })
        .eq('id', methodId);

      if (error) throw error;

      toast.success('Payment method updated successfully');
      setEditingId(null);
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment method');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {paymentMethods.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No payment methods found
          </div>
        ) : (
          <div className="divide-y">
            {paymentMethods.map((method: any) => (
              <div key={method.id} className="p-4">
                <h3 className="font-medium">{method.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                
                {editingId === method.id ? (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="publishable_key">Publishable Key</Label>
                      <Input
                        id="publishable_key"
                        type="text"
                        value={stripeConfig.publishable_key}
                        onChange={(e) => setStripeConfig(prev => ({
                          ...prev,
                          publishable_key: e.target.value
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secret_key">Secret Key</Label>
                      <Input
                        id="secret_key"
                        type="password"
                        value={stripeConfig.secret_key}
                        onChange={(e) => setStripeConfig(prev => ({
                          ...prev,
                          secret_key: e.target.value
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleSave(method.id)}>
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {method.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Button onClick={() => handleEdit(method)}>
                      Edit Stripe Keys
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};