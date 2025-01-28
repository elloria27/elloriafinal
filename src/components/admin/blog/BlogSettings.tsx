import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/components/admin/file/FileUpload";

export const BlogSettings = () => {
  const [settings, setSettings] = useState({
    enableComments: false,
    postsPerPage: "10",
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    enableSocialSharing: true,
    moderateComments: true,
    heroTitle: "",
    heroSubtitle: "",
    heroBackgroundImage: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogSettings();
  }, []);

  const loadBlogSettings = async () => {
    try {
      console.log('Loading blog settings...');
      const { data, error } = await supabase
        .from('blog_settings')
        .select('*')
        .single();

      if (error) throw error;

      console.log('Blog settings loaded:', data);
      setSettings(prev => ({
        ...prev,
        heroTitle: data.hero_title,
        heroSubtitle: data.hero_subtitle,
        heroBackgroundImage: data.hero_background_image || ''
      }));
    } catch (error) {
      console.error('Error loading blog settings:', error);
      toast.error("Error loading blog settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving blog settings...');
      const { error } = await supabase
        .from('blog_settings')
        .update({
          hero_title: settings.heroTitle,
          hero_subtitle: settings.heroSubtitle,
          hero_background_image: settings.heroBackgroundImage
        })
        .eq('id', 1);

      if (error) throw error;

      toast.success("Settings updated successfully");
      console.log('Blog settings saved successfully');
    } catch (error) {
      console.error('Error saving blog settings:', error);
      toast.error("Error saving settings");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog-hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      handleSettingChange('heroBackgroundImage', publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Error uploading image");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Blog Settings</h3>
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Settings</CardTitle>
          <CardDescription>Configure your blog's hero section appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={settings.heroTitle}
              onChange={(e) => handleSettingChange('heroTitle', e.target.value)}
              placeholder="Enter hero title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Input
              id="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={(e) => handleSettingChange('heroSubtitle', e.target.value)}
              placeholder="Enter hero subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="mt-2">
              <FileUpload onUpload={handleImageUpload} />
            </div>
            {settings.heroBackgroundImage && (
              <div className="mt-2">
                <img 
                  src={settings.heroBackgroundImage} 
                  alt="Hero background preview" 
                  className="max-w-xs rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure your blog's default behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Comments</Label>
              <p className="text-sm text-muted-foreground">Allow visitors to comment on blog posts</p>
            </div>
            <Switch
              checked={settings.enableComments}
              onCheckedChange={(checked) => handleSettingChange('enableComments', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Moderate Comments</Label>
              <p className="text-sm text-muted-foreground">Review comments before they are published</p>
            </div>
            <Switch
              checked={settings.moderateComments}
              onCheckedChange={(checked) => handleSettingChange('moderateComments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Social Sharing</Label>
              <p className="text-sm text-muted-foreground">Add social sharing buttons to posts</p>
            </div>
            <Switch
              checked={settings.enableSocialSharing}
              onCheckedChange={(checked) => handleSettingChange('enableSocialSharing', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postsPerPage">Posts per Page</Label>
            <Input
              id="postsPerPage"
              type="number"
              value={settings.postsPerPage}
              onChange={(e) => handleSettingChange('postsPerPage', e.target.value)}
              min="1"
              max="50"
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave}
        className="w-full"
      >
        Save Settings
      </Button>
    </div>
  );
};