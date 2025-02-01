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

interface AnalyticsData {
  pageViews: number;
  averageTimeOnSite: string;
  topCountries: Array<{ country: string; visits: number }>;
  topCities: Array<{ city: string; visits: number }>;
  topPages: Array<{ page: string; views: number }>;
}

export const AnalyticsWidget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    averageTimeOnSite: '0m',
    topCountries: [],
    topCities: [],
    topPages: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get total page views
        const { count: totalViews, error: viewsError } = await supabase
          .from('page_views')
          .select('*', { count: 'exact' });

        if (viewsError) throw viewsError;

        // Get top countries
        const { data: countriesData, error: countriesError } = await supabase
          .from('page_views')
          .select('country')
          .not('country', 'is', null)
          .limit(100);

        if (countriesError) throw countriesError;

        // Process countries data
        const countryCount: Record<string, number> = {};
        countriesData?.forEach((view) => {
          if (view.country) {
            countryCount[view.country] = (countryCount[view.country] || 0) + 1;
          }
        });

        const topCountries = Object.entries(countryCount)
          .map(([country, visits]) => ({ country, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 5);

        // Get top cities
        const { data: citiesData, error: citiesError } = await supabase
          .from('page_views')
          .select('city')
          .not('city', 'is', null)
          .limit(100);

        if (citiesError) throw citiesError;

        // Process cities data
        const cityCount: Record<string, number> = {};
        citiesData?.forEach((view) => {
          if (view.city) {
            cityCount[view.city] = (cityCount[view.city] || 0) + 1;
          }
        });

        const topCities = Object.entries(cityCount)
          .map(([city, visits]) => ({ city, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 5);

        // Get top pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('page_views')
          .select('page_path')
          .limit(100);

        if (pagesError) throw pagesError;

        // Process pages data
        const pageCount: Record<string, number> = {};
        pagesData?.forEach((view) => {
          if (view.page_path) {
            pageCount[view.page_path] = (pageCount[view.page_path] || 0) + 1;
          }
        });

        const topPages = Object.entries(pageCount)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // Calculate average time (placeholder for now)
        const avgTimeMinutes = 5; // This would need to be calculated based on actual session data

        const analyticsData: AnalyticsData = {
          pageViews: totalViews || 0,
          averageTimeOnSite: `${avgTimeMinutes}m`,
          topCountries,
          topCities,
          topPages
        };

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Page Views</h3>
            <p>{analyticsData.pageViews}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Avg. Time on Site</h3>
            <p>{analyticsData.averageTimeOnSite}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Top Countries</h3>
            {analyticsData.topCountries.length > 0 ? (
              <ul className="space-y-1">
                {analyticsData.topCountries.map((item, index) => (
                  <li key={index}>
                    {item.country}: {item.visits} visits
                  </li>
                ))}
              </ul>
            ) : (
              <p>No country data available</p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Top Cities</h3>
            {analyticsData.topCities.length > 0 ? (
              <ul className="space-y-1">
                {analyticsData.topCities.map((item, index) => (
                  <li key={index}>
                    {item.city}: {item.visits} visits
                  </li>
                ))}
              </ul>
            ) : (
              <p>No city data available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
