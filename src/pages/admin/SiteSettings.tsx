import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Globe, Mail } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type SiteSettings = {
  id: string;
  site_title: string;
  default_language: Database['public']['Enums']['supported_language'];
  default_currency: Database['public']['Enums']['supported_currency'];
  enable_registration: boolean;
  enable_search_indexing: boolean;
  meta_description: string | null;
  meta_keywords: string | null;
  custom_scripts: any[];
  created_at: string;
  updated_at: string;
  homepage_slug: string;
  maintenance_mode: boolean;
  contact_email: string | null;
  google_analytics_id: string | null;
  enable_cookie_consent: boolean;
  enable_https_redirect: boolean;
  max_upload_size: number;
  enable_user_avatars: boolean;
}

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;

      console.log('Settings loaded:', data);
      setSettings(data as SiteSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error("Error loading site settings");
    } finally {
      setLoading(false);
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
          homepage_slug: settings.homepage_slug,
          maintenance_mode: settings.maintenance_mode,
          contact_email: settings.contact_email,
          google_analytics_id: settings.google_analytics_id,
          enable_cookie_consent: settings.enable_cookie_consent,
          enable_https_redirect: settings.enable_https_redirect,
          max_upload_size: settings.max_upload_size,
          enable_user_avatars: settings.enable_user_avatars
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
      <div className="flex items-center justify-center min-h-[200px]">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_title">Site Title</Label>
                  <Input
                    id="site_title"
                    value={settings.site_title}
                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact_email"
                      type="email"
                      className="pl-10"
                      value={settings.contact_email || ''}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_language">Default Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Select 
                      value={settings.default_language}
                      onValueChange={(value: Database['public']['Enums']['supported_language']) => 
                        setSettings({ ...settings, default_language: value })}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="uk">Українська</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_currency">Default Currency</Label>
                  <Select 
                    value={settings.default_currency}
                    onValueChange={(value: Database['public']['Enums']['supported_currency']) => 
                      setSettings({ ...settings, default_currency: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="google_analytics">Google Analytics ID</Label>
                  <Input
                    id="google_analytics"
                    value={settings.google_analytics_id || ''}
                    onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                    placeholder="UA-XXXXXXXXX-X"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_upload_size">Maximum Upload Size (MB)</Label>
                  <Input
                    id="max_upload_size"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.max_upload_size || 10}
                    onChange={(e) => setSettings({ ...settings, max_upload_size: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on your website
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_registration}
                    onCheckedChange={(checked) => setSettings({ ...settings, enable_registration: checked })}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to temporarily disable the website
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>Cookie Consent</Label>
                    <p className="text-sm text-muted-foreground">
                      Show cookie consent banner to comply with GDPR
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_cookie_consent || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, enable_cookie_consent: checked })}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>HTTPS Redirect</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically redirect HTTP to HTTPS
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_https_redirect || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, enable_https_redirect: checked })}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>User Avatars</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to upload custom profile pictures
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_user_avatars || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, enable_user_avatars: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced website settings
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

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Search Engine Indexing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow search engines to index your website
                  </p>
                </div>
                <Switch
                  checked={settings.enable_search_indexing}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable_search_indexing: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;