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
import { Loader2 } from "lucide-react";

interface SiteSettings {
  id: string;
  site_title: string;
  default_language: 'en' | 'fr' | 'uk';
  default_currency: 'USD' | 'EUR' | 'UAH' | 'CAD';
  enable_registration: boolean;
  enable_search_indexing: boolean;
  meta_description: string | null;
  meta_keywords: string | null;
  custom_scripts: any[];
  homepage_slug: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

export default function SiteSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pages, setPages] = useState<Page[]>([]);

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
      // Ensure homepage_slug is included in the data
      setSettings({
        ...data,
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
          default_currency: settings.default_currency,
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <Button 
          onClick={handleSave} 
          disabled={saving}
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

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homepage">Homepage</Label>
                <Select 
                  value={settings.homepage_slug} 
                  onValueChange={(value) => setSettings({ ...settings, homepage_slug: value })}
                >
                  <SelectTrigger>
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
                <Label htmlFor="default_language">Default Language</Label>
                <Select 
                  value={settings.default_language}
                  onValueChange={(value: 'en' | 'fr' | 'uk') => setSettings({ ...settings, default_language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="uk">Українська</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_currency">Default Currency</Label>
                <Select 
                  value={settings.default_currency}
                  onValueChange={(value: 'USD' | 'EUR' | 'UAH' | 'CAD') => setSettings({ ...settings, default_currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="UAH">UAH (₴)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_registration"
                  checked={settings.enable_registration}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable_registration: checked })}
                />
                <Label htmlFor="enable_registration">Enable User Registration</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                  id="meta_description"
                  value={settings.meta_description || ''}
                  onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={settings.meta_keywords || ''}
                  onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_search_indexing"
                  checked={settings.enable_search_indexing}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable_search_indexing: checked })}
                />
                <Label htmlFor="enable_search_indexing">Enable Search Engine Indexing</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custom_scripts">Custom Scripts</Label>
                <textarea
                  id="custom_scripts"
                  className="w-full min-h-[100px] p-2 border rounded"
                  value={JSON.stringify(settings.custom_scripts, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setSettings({ ...settings, custom_scripts: parsed });
                    } catch (error) {
                      // Allow invalid JSON while typing
                      console.log('Invalid JSON, waiting for valid input');
                    }
                  }}
                />
                <p className="text-sm text-gray-500">
                  Enter custom scripts in JSON format
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}