import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Clock, ChartLine } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface AnalyticsData {
  pageViews: number;
  averageTimeOnSite: string;
  topCountries: Array<{ country: string; visits: number }>;
  topPages: Array<{ page: string; views: number }>;
  viewsOverTime: Array<{ date: string; views: number }>;
}

export const AnalyticsWidget = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Here we would normally fetch from a real analytics API
        // For now, using mock data
        const mockData: AnalyticsData = {
          pageViews: 15234,
          averageTimeOnSite: "3m 45s",
          topCountries: [
            { country: "United States", visits: 5230 },
            { country: "United Kingdom", visits: 3150 },
            { country: "Germany", visits: 2840 }
          ],
          topPages: [
            { page: "/home", views: 4500 },
            { page: "/products", views: 3200 },
            { page: "/about", views: 2100 }
          ],
          viewsOverTime: [
            { date: "Mon", views: 4000 },
            { date: "Tue", views: 3000 },
            { date: "Wed", views: 5000 },
            { date: "Thu", views: 2780 },
            { date: "Fri", views: 1890 },
            { date: "Sat", views: 2390 },
            { date: "Sun", views: 3490 }
          ]
        };

        setAnalytics(mockData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Page Views</div>
              <div className="text-2xl font-bold">{analytics?.pageViews.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-sm font-medium">Avg. Time on Site</div>
              <div className="text-2xl font-bold">{analytics?.averageTimeOnSite}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Views Over Time</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Top Countries</h3>
              <div className="space-y-2">
                {analytics?.topCountries.map((country, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{country.country}</span>
                    <span className="font-medium">{country.visits.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Top Pages</h3>
              <div className="space-y-2">
                {analytics?.topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{page.page}</span>
                    <span className="font-medium">{page.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};