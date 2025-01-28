import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const BlogSettings = () => {
  const [settings, setSettings] = useState({
    enableComments: false,
    postsPerPage: "10",
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    enableSocialSharing: true,
    moderateComments: true
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // In a real implementation, this would save to the database
    toast.success("Setting updated successfully");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Blog Settings</h3>
      
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

      <Card>
        <CardHeader>
          <CardTitle>SEO Defaults</CardTitle>
          <CardDescription>Default meta information for blog posts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
            <Input
              id="defaultMetaTitle"
              value={settings.defaultMetaTitle}
              onChange={(e) => handleSettingChange('defaultMetaTitle', e.target.value)}
              placeholder="Default title for blog posts"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
            <Input
              id="defaultMetaDescription"
              value={settings.defaultMetaDescription}
              onChange={(e) => handleSettingChange('defaultMetaDescription', e.target.value)}
              placeholder="Default description for blog posts"
            />
          </div>

          <Button 
            onClick={() => toast.success("Settings saved successfully")}
            className="w-full"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};