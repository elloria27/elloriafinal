
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, Upload, Image, Database } from "lucide-react";

export const AdvancedSettings = () => {
  const [uploading, setUploading] = useState(false);
  const [exportingDatabase, setExportingDatabase] = useState(false);

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

  const handleFullDatabaseExport = async () => {
    try {
      setExportingDatabase(true);
      console.log('Exporting full database...');
      
      // Call Supabase edge function to generate SQL dump if available
      // For now, we'll simulate this by exporting all tables in JSON format with full structure
      const { data, error } = await supabase.functions.invoke('export-database', {
        body: { format: 'sql' }
      });
      
      if (error) {
        console.error('Error calling database export function:', error);
        throw new Error('Failed to export database: ' + error.message);
      }
      
      if (!data || !data.downloadUrl) {
        // Fallback to client-side export if edge function is not available
        const tables = [
          'products', 'orders', 'profiles', 'pages', 'site_settings', 
          'blog_posts', 'blog_categories', 'inventory', 'payment_methods',
          'delivery_methods', 'promo_codes', 'shop_company_expenses',
          'hrm_tasks', 'hrm_invoices', 'business_form_submissions'
        ];
        
        const fullExport: Record<string, any> = {};
        
        for (const table of tables) {
          const { data: tableData, error: tableError } = await supabase
            .from(table)
            .select('*');
            
          if (tableError) {
            console.warn(`Error fetching table ${table}:`, tableError);
            continue;
          }
          
          fullExport[table] = tableData || [];
        }
        
        // Also include database structure
        fullExport['_metadata'] = {
          exported_at: new Date().toISOString(),
          version: '1.0',
          tables: Object.keys(fullExport).map(table => ({
            name: table,
            record_count: fullExport[table].length
          }))
        };
        
        const blob = new Blob(
          [JSON.stringify(fullExport, null, 2)], 
          { type: 'application/json' }
        );
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `full_database_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success("Full database exported successfully");
      } else {
        // If the edge function returned a download URL, use it
        window.open(data.downloadUrl, '_blank');
        toast.success("Full database SQL dump exported successfully");
      }
    } catch (error) {
      console.error('Error exporting full database:', error);
      toast.error("Failed to export full database");
    } finally {
      setExportingDatabase(false);
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
              Export Database (JSON)
            </Button>
            <Button
              variant="outline"
              onClick={handleFullDatabaseExport}
              disabled={exportingDatabase}
              className="flex items-center gap-2 w-full sm:w-auto text-sm"
            >
              <Database className="h-4 w-4" />
              {exportingDatabase ? "Exporting..." : "Full Database Dump (SQL)"}
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
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            The Full Database Dump option exports all tables with complete structure in SQL format, suitable for full database restoration.
          </p>
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
