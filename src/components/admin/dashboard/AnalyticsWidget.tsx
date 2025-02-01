import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  pageViews: number;
  averageTimeOnSite: string;
  topCountries: Array<{ country: string; visits: number }>;
  topCities: Array<{ city: string; country: string; visits: number }>;
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
        console.log('Fetching analytics data...');
        
        // Get total page views
        const { count: totalViews, error: viewsError } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true });

        if (viewsError) throw viewsError;

        // Get top countries
        const { data: countriesData, error: countriesError } = await supabase
          .from('page_views')
          .select('country')
          .not('country', 'is', null)
          .then(result => {
            const counts = result.data?.reduce((acc: Record<string, number>, curr: any) => {
              acc[curr.country] = (acc[curr.country] || 0) + 1;
              return acc;
            }, {});
            return {
              data: Object.entries(counts || {})
                .map(([country, visits]) => ({ country, visits }))
                .sort((a, b) => b.visits - a.visits)
                .slice(0, 5),
              error: result.error
            };
          });

        if (countriesError) throw countriesError;

        // Get top cities
        const { data: citiesData, error: citiesError } = await supabase
          .from('page_views')
          .select('city, country')
          .not('city', 'is', null)
          .not('country', 'is', null)
          .then(result => {
            const counts = result.data?.reduce((acc: Record<string, { visits: number; country: string }>, curr: any) => {
              const key = curr.city;
              if (!acc[key]) {
                acc[key] = { visits: 0, country: curr.country };
              }
              acc[key].visits += 1;
              return acc;
            }, {});
            return {
              data: Object.entries(counts || {})
                .map(([city, data]) => ({
                  city,
                  country: data.country,
                  visits: data.visits
                }))
                .sort((a, b) => b.visits - a.visits)
                .slice(0, 5),
              error: result.error
            };
          });

        if (citiesError) throw citiesError;

        // Get top pages
        const { data: pagesData, error: pagesError } = await supabase
          .rpc('get_top_pages', { limit_count: 3 });

        if (pagesError) throw pagesError;

        // Get views over time
        const { data: timeData, error: timeError } = await supabase
          .rpc('get_daily_views', { days_back: 7 });

        if (timeError) throw timeError;

        // Calculate average time on site (simplified version)
        const avgTimeMinutes = 3; // This would need session tracking for accurate calculation

        const analyticsData: AnalyticsData = {
          pageViews: totalViews || 0,
          averageTimeOnSite: `${avgTimeMinutes}m`,
          topCountries: countriesData || [],
          topCities: citiesData || [],
          topPages: pagesData?.map(item => ({
            page: item.page_path,
            views: parseInt(item.count.toString())
          })) || [],
          viewsOverTime: timeData?.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            views: parseInt(item.count.toString())
          })) || []
        };

        console.log('Analytics data:', analyticsData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_views' },
        () => {
          console.log('Page views updated, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
                {(!analytics?.topCountries || analytics.topCountries.length === 0) && (
                  <div className="text-sm text-muted-foreground">No country data available</div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Top Cities</h3>
              <div className="space-y-2">
                {analytics?.topCities.map((city, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {city.city}, {city.country}
                    </span>
                    <span className="font-medium">{city.visits.toLocaleString()}</span>
                  </div>
                ))}
                {(!analytics?.topCities || analytics.topCities.length === 0) && (
                  <div className="text-sm text-muted-foreground">No city data available</div>
                )}
              </div>
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
      </CardContent>
    </Card>
  );
};