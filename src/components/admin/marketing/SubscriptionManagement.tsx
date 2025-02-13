
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Subscription {
  id: string;
  email: string;
  created_at: string;
  source: string | null;
}

export const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  useEffect(() => {
    fetchSubscriptions();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions' },
        () => {
          console.log('Subscriptions updated, refreshing...');
          fetchSubscriptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, email, created_at, source")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSubscriptions(data || []);
    } catch (error: any) {
      toast.error("Error fetching subscriptions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === "all" || subscription.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const sources = Array.from(new Set(subscriptions.map(s => s.source || "website")));
  const stats = {
    total: subscriptions.length,
    bySource: sources.reduce((acc, source) => {
      acc[source] = subscriptions.filter(s => (s.source || "website") === source).length;
      return acc;
    }, {} as Record<string, number>)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Newsletter Subscriptions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Total Subscribers</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        {Object.entries(stats.bySource).map(([source, count]) => (
          <div key={source} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-600">From {source}</h3>
            <p className="text-3xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select
          value={sourceFilter}
          onValueChange={setSourceFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map(source => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Subscribed On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.email}</TableCell>
                <TableCell>{subscription.source || "Website"}</TableCell>
                <TableCell>
                  {format(new Date(subscription.created_at), "MMM d, yyyy h:mm a")}
                </TableCell>
              </TableRow>
            ))}
            {filteredSubscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No subscriptions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
