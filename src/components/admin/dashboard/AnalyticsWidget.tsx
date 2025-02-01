import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartTooltip } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface AnalyticsData {
  pageViews: number;
  averageTimeOnSite: string;
  topCountries: Array<{ country: string; visits: number }>;
  topCities: Array<{ city: string; visits: number }>;
  topPages: Array<{ page: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}

export const AnalyticsWidget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    averageTimeOnSite: '0m',
    topCountries: [],
    topCities: [],
    topPages: [],
    dailyViews: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Fetching analytics data...');
        
        const { data: viewsData, error: viewsError } = await supabase
          .from('page_views')
          .select('*');

        if (viewsError) throw viewsError;

        // Process countries data
        const countryCount: Record<string, number> = {};
        viewsData?.forEach((view) => {
          if (view.country) {
            countryCount[view.country] = (countryCount[view.country] || 0) + 1;
          }
        });

        const topCountries = Object.entries(countryCount)
          .map(([country, visits]) => ({ country, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 5);

        // Process cities data
        const cityCount: Record<string, number> = {};
        viewsData?.forEach((view) => {
          if (view.city) {
            cityCount[view.city] = (cityCount[view.city] || 0) + 1;
          }
        });

        const topCities = Object.entries(cityCount)
          .map(([city, visits]) => ({ city, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 5);

        // Process pages data
        const pageCount: Record<string, number> = {};
        viewsData?.forEach((view) => {
          if (view.page_path) {
            pageCount[view.page_path] = (pageCount[view.page_path] || 0) + 1;
          }
        });

        const topPages = Object.entries(pageCount)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // Process daily views data
        const dailyViewsMap = new Map<string, number>();
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        // Initialize all days with 0 views
        last7Days.forEach(date => {
          dailyViewsMap.set(date, 0);
        });

        // Count views for each day
        viewsData?.forEach(view => {
          const date = new Date(view.created_at).toISOString().split('T')[0];
          if (dailyViewsMap.has(date)) {
            dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1);
          }
        });

        const dailyViews = Array.from(dailyViewsMap.entries()).map(([date, views]) => ({
          date,
          views
        }));

        // Calculate average time (placeholder for now)
        const avgTimeMinutes = 5;

        const analyticsData: AnalyticsData = {
          pageViews: viewsData?.length || 0,
          averageTimeOnSite: `${avgTimeMinutes}m`,
          topCountries,
          topCities,
          topPages,
          dailyViews
        };

        console.log('Analytics data processed:', analyticsData);
        setAnalyticsData(analyticsData);
        setError(null);
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
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Your site's performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Total Page Views</h3>
              <p className="text-3xl font-bold text-primary">{analyticsData.pageViews}</p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Average Time on Site</h3>
              <p className="text-3xl font-bold text-primary">{analyticsData.averageTimeOnSite}</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.dailyViews}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  dy={10}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  dx={-10}
                />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#0094F4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Most Visited Pages</h3>
              {analyticsData.topPages.length > 0 ? (
                <ul className="space-y-3">
                  {analyticsData.topPages.map((item, index) => (
                    <li key={index} className="border-b pb-2 last:border-0">
                      <div className="text-sm font-medium">{item.page}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.views} views
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No page data available</p>
              )}
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
              {analyticsData.topCountries.length > 0 ? (
                <ul className="space-y-3">
                  {analyticsData.topCountries.map((item, index) => (
                    <li key={index} className="border-b pb-2 last:border-0">
                      <div className="text-sm font-medium">{item.country}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.visits} visits
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No country data available</p>
              )}
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Top Cities</h3>
              {analyticsData.topCities.length > 0 ? (
                <ul className="space-y-3">
                  {analyticsData.topCities.map((item, index) => (
                    <li key={index} className="border-b pb-2 last:border-0">
                      <div className="text-sm font-medium">{item.city}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.visits} visits
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No city data available</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};