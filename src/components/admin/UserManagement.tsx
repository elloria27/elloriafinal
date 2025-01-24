import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  user_roles: { role: 'admin' | 'client' }[];
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      // First, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      if (profilesError) throw profilesError;

      // Then, get user roles for each profile
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map user roles to profiles
      const formattedUsers = profiles.map(profile => {
        const userRole = userRoles.find(role => role.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email || 'N/A',
          full_name: profile.full_name || 'N/A',
          user_roles: userRole ? [{ role: userRole.role as 'admin' | 'client' }] : [{ role: 'client' }]
        };
      });

      console.log('Formatted users:', formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error("Failed to update user role");
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'client' })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error("Failed to update user role");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={fetchUsers}>Refresh Users</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.user_roles[0]?.role || 'client'}</TableCell>
              <TableCell>
                {user.user_roles[0]?.role === 'admin' ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveAdmin(user.id)}
                  >
                    Remove Admin
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleMakeAdmin(user.id)}
                  >
                    Make Admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};