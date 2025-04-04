import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit2, Trash2, Key } from "lucide-react";

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  phone_number: string | null;
  address: string | null;
  country: string | null;
  region: string | null;
}

interface UserRole {
  user_id: string;
  role: 'admin' | 'client';
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Starting to fetch users data...');
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone_number,
          address,
          country,
          region
        `);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles fetched successfully:', profiles);

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      console.log('User roles fetched successfully:', userRoles);

      const roleMap = new Map(userRoles?.map(role => [role.user_id, role.role]));

      const usersWithRoles = profiles?.map(profile => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        role: roleMap.get(profile.id) || 'client',
        phone_number: profile.phone_number,
        address: profile.address,
        country: profile.country,
        region: profile.region
      })) || [];

      console.log('Combined users with roles:', usersWithRoles);
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'client') => {
    try {
      console.log('Updating user role:', { userId, newRole });
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("User role updated successfully");
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error("Failed to update user role");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        full_name: formData.get('full_name')?.toString() || '',
        phone_number: formData.get('phone_number')?.toString() || '',
        address: formData.get('address')?.toString() || '',
        country: formData.get('country')?.toString() || '',
        region: formData.get('region')?.toString() || '',
        updated_at: new Date().toISOString(),
      };

      console.log('Updating user with data:', updates);

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', selectedUser.id);

      if (error) throw error;

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...updates }
            : user
        )
      );

      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Starting user deletion process for ID:', userId);
      
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('Error in delete process:', error);
        throw error;
      }

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success("User deleted successfully");
      
      await fetchUsers();
    } catch (error) {
      console.error('Error in delete process:', error);
      toast.error("Failed to delete user completely. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordChange = async (userId: string) => {
    try {
      console.log('Changing password for user:', userId);
      
      if (!newPassword) {
        toast.error("Password cannot be empty");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      
      const { error } = await supabase.functions.invoke('admin-change-password', {
        body: { userId, newPassword }
      });

      if (error) {
        console.error('Error changing password:', error);
        toast.error(error.message || "Failed to update password");
        return;
      }

      toast.success("Password updated successfully");
      setIsPasswordDialogOpen(false);
      setNewPassword("");
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Failed to update password");
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
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
              <TableCell>{user.full_name || 'N/A'}</TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'client' : 'admin')}
                  >
                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </Button>
                  
                  <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setSelectedUser(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateUser} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            defaultValue={selectedUser?.full_name || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Phone Number</Label>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            defaultValue={selectedUser?.phone_number || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            defaultValue={selectedUser?.address || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            defaultValue={selectedUser?.country || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="region">Region</Label>
                          <Input
                            id="region"
                            name="region"
                            defaultValue={selectedUser?.region || ''}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Save Changes
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isPasswordDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                    setIsPasswordDialogOpen(open);
                    if (!open) {
                      setSelectedUser(null);
                      setNewPassword("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handlePasswordChange(user.id);
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            name="new_password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Update Password
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};