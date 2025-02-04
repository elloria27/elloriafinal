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
          .select('*')
          .order('created_at', { ascending: true });

        if (viewsError) throw viewsError;

        console.log('Raw views data:', viewsData);

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
          date.setDate(date.getDate() - (6 - i)); // Changed to show last 7 days including today
          return date.toISOString().split('T')[0];
        });

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

        console.log('Processed daily views:', dailyViews);

        // Calculate total page views
        const totalPageViews = viewsData?.length || 0;

        // Calculate average time (placeholder for now)
        const avgTimeMinutes = 5;

        const analyticsData: AnalyticsData = {
          pageViews: totalPageViews,
          averageTimeOnSite: `${avgTimeMinutes}m`,
          topCountries,
          topCities,
          topPages,
          dailyViews
        };

        console.log('Final analytics data:', analyticsData);
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

    // Set up real-time subscription
    const channel = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_views' },
        () => {
          console.log('Page views updated, refreshing data...');
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-[300px]" />;
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Site performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground mb-1">Page Views</p>
            <p className="text-2xl font-bold text-primary">{analyticsData.pageViews}</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Time</p>
            <p className="text-2xl font-bold text-primary">{analyticsData.averageTimeOnSite}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] w-full">
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
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
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

        {/* Analytics Lists */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Most Visited Pages */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Most Visited Pages</h3>
            <div className="space-y-2">
              {analyticsData.topPages.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate flex-1">{item.page}</span>
                  <span className="text-muted-foreground ml-2">{item.views}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Top Countries</h3>
            <div className="space-y-2">
              {analyticsData.topCountries.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate flex-1">{item.country}</span>
                  <span className="text-muted-foreground ml-2">{item.visits}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Top Cities</h3>
            <div className="space-y-2">
              {analyticsData.topCities.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate flex-1">{item.city}</span>
                  <span className="text-muted-foreground ml-2">{item.visits}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};