import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminRole();
  }, []);

  const checkAdminRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleError) throw roleError;

      if (roleData?.role !== 'admin') {
        toast.error("Unauthorized access");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin role:', error);
      toast.error("Error checking permissions");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Admin dashboard content will go here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users Management</h2>
          <p className="text-gray-600">Manage user accounts and roles</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <p className="text-gray-600">View and manage orders</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <p className="text-gray-600">Manage product inventory</p>
        </div>
      </div>
    </div>
  );
}