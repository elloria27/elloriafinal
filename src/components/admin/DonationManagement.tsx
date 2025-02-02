import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export const DonationManagement = () => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Donations</h2>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations?.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  {format(new Date(donation.created_at), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell>{donation.donor_name || 'Anonymous'}</TableCell>
                <TableCell>{donation.donor_email || '-'}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: donation.currency || 'USD'
                  }).format(donation.amount)}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    donation.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {donation.status}
                  </span>
                </TableCell>
                <TableCell>{donation.payment_method || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};