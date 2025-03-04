
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, Upload, Image, Database, RefreshCw } from "lucide-react";

export const AdvancedSettings = () => {
  const [uploading, setUploading] = useState(false);
  const [importingDemo, setImportingDemo] = useState(false);

  const handleDatabaseExport = async () => {
    try {
      console.log('Exporting database...');
      const tables = ['products', 'orders', 'profiles', 'pages', 'site_settings'] as const;
      const exportData: Record<string, any> = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (error) throw error;
        exportData[table] = data;
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `database_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Database exported successfully");
    } catch (error) {
      console.error('Error exporting database:', error);
      toast.error("Failed to export database");
    }
  };

  const handleDatabaseImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      console.log('Importing database from file:', file.name);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          const tables = ['products', 'orders', 'profiles', 'pages', 'site_settings'] as const;
          
          for (const table of tables) {
            if (importData[table]) {
              const { error } = await supabase
                .from(table)
                .upsert(importData[table]);

              if (error) throw error;
            }
          }

          toast.success("Database imported successfully");
        } catch (error) {
          console.error('Error processing import:', error);
          toast.error("Failed to import database");
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing database:', error);
      toast.error("Failed to import database");
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      console.log('Uploading favicon:', file.name);

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(`favicon/${file.name}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(`favicon/${file.name}`);

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ favicon_url: publicUrl })
        .eq('id', '1'); // Convert number to string here

      if (updateError) throw updateError;

      toast.success("Favicon uploaded successfully");
      
      // Update favicon in the document
      const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
      (favicon as HTMLLinkElement).type = 'image/x-icon';
      (favicon as HTMLLinkElement).rel = 'shortcut icon';
      (favicon as HTMLLinkElement).href = publicUrl;
      document.getElementsByTagName('head')[0].appendChild(favicon);
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast.error("Failed to upload favicon");
    } finally {
      setUploading(false);
    }
  };

  const handleImportDemoContent = async () => {
    try {
      setImportingDemo(true);
      console.log('Importing demo content...');

      // Call the setup-wizard function with a specific action to import demo data
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        body: { action: 'import-demo-data' }
      });

      if (error) throw error;
      console.log("Demo content import response:", data);

      toast.success("Demo content imported successfully");
    } catch (error) {
      console.error('Error importing demo content:', error);
      toast.error("Failed to import demo content");
    } finally {
      setImportingDemo(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>
          Manage database and site appearance settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Database Management</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleDatabaseExport}
              className="flex items-center gap-2 w-full sm:w-auto text-sm"
            >
              <Download className="h-4 w-4" />
              Export Database
            </Button>
            <div className="relative w-full sm:w-auto">
              <Input
                type="file"
                accept=".json"
                onChange={handleDatabaseImport}
                className="hidden"
                id="database-import"
              />
              <Button
                variant="outline"
                asChild
                className="flex items-center gap-2 w-full"
              >
                <label htmlFor="database-import" className="cursor-pointer text-sm">
                  <Upload className="h-4 w-4" />
                  Import Database
                </label>
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleImportDemoContent}
              disabled={importingDemo}
              className="flex items-center gap-2 w-full sm:w-auto text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${importingDemo ? 'animate-spin' : ''}`} />
              {importingDemo ? "Importing..." : "Import Demo Content"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Site Icon (Favicon)</h3>
          <div className="relative w-full sm:w-auto">
            <Input
              type="file"
              accept=".ico,.png,.jpg,.jpeg"
              onChange={handleFaviconUpload}
              className="hidden"
              id="favicon-upload"
              disabled={uploading}
            />
            <Button
              variant="outline"
              asChild
              className="flex items-center gap-2 w-full sm:w-auto text-sm"
              disabled={uploading}
            >
              <label htmlFor="favicon-upload" className="cursor-pointer">
                <Image className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Favicon"}
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
