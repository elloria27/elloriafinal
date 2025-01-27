import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Globe, Robot, Search, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Page {
  id: string;
  title: string;
  slug: string;
  allow_indexing: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
}

export const SeoSettings = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      console.log('Fetching pages for SEO management...');
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug, allow_indexing, meta_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image')
        .order('title');

      if (error) throw error;

      console.log('Pages fetched:', data);
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error("Error loading pages");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeoSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPage) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        allow_indexing: formData.get('allow_indexing') === 'on',
        meta_title: formData.get('meta_title'),
        meta_description: formData.get('meta_description'),
        meta_keywords: formData.get('meta_keywords'),
        canonical_url: formData.get('canonical_url'),
        og_title: formData.get('og_title'),
        og_description: formData.get('og_description'),
        og_image: formData.get('og_image'),
      };

      console.log('Updating SEO settings:', updates);

      const { error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', selectedPage.id);

      if (error) throw error;

      toast.success("SEO settings updated successfully");
      setIsEditDialogOpen(false);
      await fetchPages();
      await generateRobotsTxt();
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      toast.error("Failed to update SEO settings");
    }
  };

  const generateRobotsTxt = async () => {
    try {
      console.log('Generating robots.txt content...');
      let robotsTxtContent = "User-agent: *\n";
      
      // Add global settings
      const { data: siteSettings } = await supabase
        .from('site_settings')
        .select('enable_search_indexing')
        .single();

      if (siteSettings?.enable_search_indexing === false) {
        robotsTxtContent += "Disallow: /\n";
      } else {
        // Add specific page rules
        pages.forEach(page => {
          if (!page.allow_indexing) {
            robotsTxtContent += `Disallow: /${page.slug}\n`;
          }
        });

        // Add common paths to disallow
        robotsTxtContent += "\n# Admin and system paths\n";
        robotsTxtContent += "Disallow: /admin\n";
        robotsTxtContent += "Disallow: /api/\n";
        robotsTxtContent += "Disallow: /auth/\n";

        // Add sitemap reference if exists
        robotsTxtContent += "\n# Sitemap\n";
        robotsTxtContent += "Sitemap: /sitemap.xml\n";
      }

      // Create a Blob and download the robots.txt file
      const blob = new Blob([robotsTxtContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robots.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('robots.txt generated successfully');
      toast.success("robots.txt file generated successfully");
    } catch (error) {
      console.error('Error generating robots.txt:', error);
      toast.error("Error generating robots.txt file");
    }
  };

  if (loading) {
    return <div>Loading SEO settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Management
          </CardTitle>
          <CardDescription>
            Manage search engine optimization settings for your website pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={generateRobotsTxt} className="flex items-center gap-2">
              <Robot className="h-4 w-4" />
              Generate robots.txt
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Indexing</TableHead>
                <TableHead>Meta Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className={`h-4 w-4 ${page.allow_indexing ? 'text-green-500' : 'text-red-500'}`} />
                      {page.allow_indexing ? 'Indexed' : 'Not Indexed'}
                    </div>
                  </TableCell>
                  <TableCell>{page.meta_title || page.title}</TableCell>
                  <TableCell>
                    <Dialog open={isEditDialogOpen && selectedPage?.id === page.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setSelectedPage(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPage(page)}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit SEO Settings - {page.title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateSeoSettings} className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="allow_indexing"
                              name="allow_indexing"
                              defaultChecked={page.allow_indexing}
                            />
                            <Label htmlFor="allow_indexing">Allow Search Engine Indexing</Label>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input
                              id="meta_title"
                              name="meta_title"
                              defaultValue={page.meta_title || ''}
                              placeholder={page.title}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <Textarea
                              id="meta_description"
                              name="meta_description"
                              defaultValue={page.meta_description || ''}
                              placeholder="Enter a description for search results..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="meta_keywords">Meta Keywords</Label>
                            <Input
                              id="meta_keywords"
                              name="meta_keywords"
                              defaultValue={page.meta_keywords || ''}
                              placeholder="keyword1, keyword2, keyword3"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="canonical_url">Canonical URL</Label>
                            <Input
                              id="canonical_url"
                              name="canonical_url"
                              defaultValue={page.canonical_url || ''}
                              placeholder={`https://yourdomain.com/${page.slug}`}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="og_title">Open Graph Title</Label>
                            <Input
                              id="og_title"
                              name="og_title"
                              defaultValue={page.og_title || ''}
                              placeholder={page.title}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="og_description">Open Graph Description</Label>
                            <Textarea
                              id="og_description"
                              name="og_description"
                              defaultValue={page.og_description || ''}
                              placeholder="Enter a description for social media..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="og_image">Open Graph Image URL</Label>
                            <Input
                              id="og_image"
                              name="og_image"
                              defaultValue={page.og_image || ''}
                              placeholder="https://yourdomain.com/og-image.jpg"
                            />
                          </div>

                          <Button type="submit" className="w-full">
                            Save SEO Settings
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};