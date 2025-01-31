import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DeliveryMethodManagement = () => {
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  const fetchDeliveryMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveryMethods(data || []);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
      toast.error('Failed to load delivery methods');
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold">Delivery Methods</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {deliveryMethods.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No delivery methods found
          </div>
        ) : (
          <div className="divide-y">
            {deliveryMethods.map((method: any) => (
              <div key={method.id} className="p-4">
                <h3 className="font-medium">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className={`px-2 py-1 rounded-full ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {method.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-gray-600">
                    Base Price: ${method.base_price}
                  </span>
                  {method.estimated_days && (
                    <span className="text-gray-600">
                      Estimated Days: {method.estimated_days}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};