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
import { Loader2, Download, Upload, Image, Trash2, Import } from "lucide-react";
import { SeoSettings } from "@/components/admin/seo/SeoSettings";
import { AdvancedSettings } from "@/components/admin/settings/AdvancedSettings";
import { importDefaultSiteSettings } from "@/utils/supabase-helpers";
import type { Database } from "@/integrations/supabase/types";

type SupportedLanguage = Database['public']['Enums']['supported_language'];

type SiteSettings = {
  id: string;
  site_title: string;
  default_language: SupportedLanguage;
  enable_registration: boolean;
  enable_search_indexing: boolean;
  meta_description: string | null;
  meta_keywords: string | null;
  custom_scripts: any[];
  created_at: string;
  updated_at: string;
  homepage_slug: string;
  logo_url: string | null;
}

export default function SiteSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pages, setPages] = useState<Array<{ id: string; title: string; slug: string; }>>([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);

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
        default_language: (data.default_language || "en") as SupportedLanguage,
        custom_scripts: Array.isArray(data.custom_scripts) ? data.custom_scripts : [],
        homepage_slug: data.homepage_slug || '',
        logo_url: data.logo_url || null
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

  const handleImportDefaultSettings = async () => {
    try {
      setImporting(true);
      const result = await importDefaultSiteSettings();
      
      if (result.success) {
        toast.success(result.message);
        // Reload settings to reflect the changes
        await loadSettings();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error importing default settings:', error);
      toast.error(`Error importing default settings: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setImporting(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setUploadingLogo(true);
      console.log('Uploading logo:', file.name);

      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      console.log('Logo uploaded successfully:', uploadData);

      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      if (!settings) return;

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({
          logo_url: publicUrlData.publicUrl
        })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setSettings({
        ...settings,
        logo_url: publicUrlData.publicUrl
      });

      toast.success('Logo updated successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!settings?.logo_url) return;

    try {
      setSaving(true);
      const fileName = settings.logo_url.split('/').pop();
      
      if (fileName) {
        const { error: deleteError } = await supabase.storage
          .from('logos')
          .remove([fileName]);

        if (deleteError) throw deleteError;
      }

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ logo_url: null })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setSettings({
        ...settings,
        logo_url: null
      });

      toast.success('Logo removed successfully');
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('Failed to remove logo');
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
    // If no settings exist, show an import button
    return (
      <div className="container max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-lg text-gray-500">No site settings found. Would you like to import the default settings?</p>
          <Button 
            onClick={handleImportDefaultSettings}
            disabled={importing}
            size="lg"
            className="mt-4"
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Import className="mr-2 h-5 w-5" />
                Import Default Settings
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Site Settings</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            onClick={handleImportDefaultSettings} 
            disabled={importing || saving}
            variant="outline"
            className="w-full md:w-auto"
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Import className="mr-2 h-4 w-4" />
                Import Default Settings
              </>
            )}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || importing}
            size="lg"
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-8 py-6 rounded-xl"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-gray-100/80 p-1.5 rounded-xl">
          <TabsTrigger 
            value="general" 
            className="flex-1 py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="seo" 
            className="flex-1 py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            SEO
          </TabsTrigger>
          <TabsTrigger 
            value="advanced" 
            className="flex-1 py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-0 shadow-sm">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle className="text-2xl font-semibold">General Settings</CardTitle>
              <CardDescription className="text-gray-500 text-base">
                Basic settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="site_logo" className="text-base font-medium">Site Logo</Label>
                {settings.logo_url ? (
                  <div className="space-y-4">
                    <div className="max-w-xs">
                      <img 
                        src={settings.logo_url} 
                        alt="Site logo" 
                        className="w-full h-auto rounded-lg border"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        disabled={uploadingLogo}
                        className="w-full sm:w-auto"
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Change Logo
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveLogo}
                        disabled={uploadingLogo}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      disabled={uploadingLogo}
                      className="w-full max-w-xs h-32 border-dashed"
                    >
                      {uploadingLogo ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Image className="mr-2 h-5 w-5" />
                          Upload Logo
                        </>
                      )}
                    </Button>
                  </div>
                )}
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500">
                  Recommended size: 200x50 pixels. Supports PNG, JPG, or SVG.
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="site_title" className="text-base font-medium">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-3">
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

              <div className="space-y-3">
                <Label htmlFor="default_language" className="text-base font-medium">Default Language</Label>
                <Select 
                  value={settings.default_language}
                  onValueChange={(value: SupportedLanguage) => setSettings({ ...settings, default_language: value })}
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
                <div className="space-y-1">
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
          <AdvancedSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
