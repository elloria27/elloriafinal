import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const BlogSettings = () => {
  const [settings, setSettings] = useState({
    enableComments: false,
    postsPerPage: "10",
    defaultMetaTitle: "",
    defaultMetaDescription: ""
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
        </CardContent>
      </Card>
    </div>
  );
};