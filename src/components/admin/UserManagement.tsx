import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type User = Database['public']['Tables']['profiles']['Row'];

export const UserManagement: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'updated_at'>>({
    full_name: '',
    email: '',
    phone_number: null,
    address: null,
    country: null,
    region: null,
    language: null,
    currency: null,
    email_notifications: null,
    marketing_emails: null,
    completed_initial_setup: null,
    selected_delivery_method: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('profiles').insert([newUser]);
      if (error) throw error;
      toast.success("User added successfully");
      setNewUser({
        full_name: '',
        email: '',
        phone_number: null,
        address: null,
        country: null,
        region: null,
        language: null,
        currency: null,
        email_notifications: null,
        marketing_emails: null,
        completed_initial_setup: null,
        selected_delivery_method: null,
      });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error("Failed to add user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Management</h1>
      <form onSubmit={handleAddUser}>
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={newUser.full_name}
            onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>
        <Button type="submit">Add User</Button>
      </form>
      <Table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Country</th>
            <th>Region</th>
            <th>Language</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.address}</td>
              <td>{user.country}</td>
              <td>{user.region}</td>
              <td>{user.language}</td>
              <td>{user.currency}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;
