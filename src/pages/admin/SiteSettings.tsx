
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, Upload, Image } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { SeoSettings } from "@/components/admin/seo/SeoSettings";
import { AdvancedSettings } from "@/components/admin/settings/AdvancedSettings";

type SiteSettings = {
  id: string;
  site_title: string;
  default_language: Database['public']['Enums']['supported_language'];
  enable_registration: boolean;
  enable_search_indexing: boolean;
  meta_description: string | null;
  meta_keywords: string | null;
  custom_scripts: any[];
  created_at: string;
  updated_at: string;
  homepage_slug: string;
}

export default function SiteSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pages, setPages] = useState<Array<{ id: string; title: string; slug: string; }>>([]);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      console.log('Checking admin status...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found');
        toast.error("Please sign in to access admin settings");
        navigate("/login");
        return;
      }

      const { data: isAdmin } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });

      if (!isAdmin) {
        console.log('User is not an admin');
        toast.error("Admin access required");
        navigate("/");
        return;
      }

      console.log('Admin access confirmed, loading data...');
      await Promise.all([
        loadSettings(),
        loadPages()
      ]);

    } catch (error) {
      console.error('Error in admin check:', error);
      toast.error("Error checking admin access");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      console.log('Loading site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;

      console.log('Settings loaded:', data);
      
      // Transform the data to match our expected types
      setSettings({
        ...data,
        custom_scripts: Array.isArray(data.custom_scripts) ? data.custom_scripts : [],
        homepage_slug: data.homepage_slug || ''
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error("Error loading site settings");
    }
  };

  const loadPages = async () => {
    try {
      console.log('Loading pages...');
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug')
        .eq('is_published', true);

      if (error) throw error;

      console.log('Pages loaded:', data);
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error("Error loading pages");
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      console.log('Saving settings:', settings);

      const { error } = await supabase
        .from('site_settings')
        .update({
          site_title: settings.site_title,
          default_language: settings.default_language,
          enable_registration: settings.enable_registration,
          enable_search_indexing: settings.enable_search_indexing,
          meta_description: settings.meta_description,
          meta_keywords: settings.meta_keywords,
          custom_scripts: settings.custom_scripts,
          homepage_slug: settings.homepage_slug
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast.success("Settings saved successfully");
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: Could not load site settings</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full justify-start mb-6 bg-gray-100/80 p-1 rounded-lg">
          <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
          <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">General Settings</CardTitle>
              <CardDescription className="text-gray-500">
                Basic settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site_title" className="text-base font-medium">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homepage" className="text-base font-medium">Homepage</Label>
                <Select 
                  value={settings.homepage_slug} 
                  onValueChange={(value) => setSettings({ ...settings, homepage_slug: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select homepage" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.slug}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_language" className="text-base font-medium">Default Language</Label>
                <Select 
                  value={settings.default_language}
                  onValueChange={(value: 'en' | 'fr' | 'uk') => setSettings({ ...settings, default_language: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="uk">Українська</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="enable_registration" className="text-base font-medium">Enable User Registration</Label>
                  <p className="text-sm text-gray-500">Allow new users to register on your site</p>
                </div>
                <Switch
                  id="enable_registration"
                  checked={settings.enable_registration}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable_registration: checked })}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <SeoSettings />
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Advanced Settings</CardTitle>
              <CardDescription className="text-gray-500">
                Manage database and site appearance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Database Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12" onClick={() => {}}>
                    <Download className="mr-2 h-5 w-5" />
                    Export Database
                  </Button>
                  <Button variant="outline" className="h-12" onClick={() => {}}>
                    <Upload className="mr-2 h-5 w-5" />
                    Import Database
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Site Icon (Favicon)</h3>
                <Button variant="outline" className="w-full h-12" onClick={() => {}}>
                  <Image className="mr-2 h-5 w-5" />
                  Upload Favicon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
