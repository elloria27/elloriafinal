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
import { Globe, Bot, Search, FileDown } from "lucide-react";
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
  updated_at: string;
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
      console.log('Fetching pages for SEO management using admin_fetch_all_pages...');
      const { data, error } = await supabase.rpc('admin_fetch_all_pages');

      if (error) {
        console.error('Error fetching pages:', error);
        toast.error("Error loading pages");
        return;
      }

      console.log('Pages fetched:', data);
      setPages(data || []);
    } catch (error) {
      console.error('Error in fetchPages:', error);
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
        meta_title: formData.get('meta_title')?.toString() || null,
        meta_description: formData.get('meta_description')?.toString() || null,
        meta_keywords: formData.get('meta_keywords')?.toString() || null,
        canonical_url: formData.get('canonical_url')?.toString() || null,
        og_title: formData.get('og_title')?.toString() || null,
        og_description: formData.get('og_description')?.toString() || null,
        og_image: formData.get('og_image')?.toString() || null,
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
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      toast.error("Failed to update SEO settings");
    }
  };

  const generateRobotsTxt = () => {
    try {
      console.log('Generating robots.txt content...');
      let robotsTxtContent = "User-agent: *\n";
      
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

  const generateSitemapXml = () => {
    try {
      console.log('Generating sitemap.xml content...');
      const baseUrl = window.location.origin;
      
      let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Add homepage
      sitemapContent += '  <url>\n';
      sitemapContent += `    <loc>${baseUrl}</loc>\n`;
      sitemapContent += '    <changefreq>daily</changefreq>\n';
      sitemapContent += '    <priority>1.0</priority>\n';
      sitemapContent += '  </url>\n';

      // Add pages
      pages.forEach(page => {
        if (page.allow_indexing) {
          sitemapContent += '  <url>\n';
          sitemapContent += `    <loc>${baseUrl}/${page.slug}</loc>\n`;
          sitemapContent += `    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>\n`;
          sitemapContent += '    <changefreq>weekly</changefreq>\n';
          sitemapContent += '    <priority>0.8</priority>\n';
          sitemapContent += '  </url>\n';
        }
      });

      sitemapContent += '</urlset>';

      // Create a Blob and download the sitemap.xml file
      const blob = new Blob([sitemapContent], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('sitemap.xml generated successfully');
      toast.success("sitemap.xml file generated successfully");
    } catch (error) {
      console.error('Error generating sitemap.xml:', error);
      toast.error("Error generating sitemap.xml file");
    }
  };

  if (loading) {
    return <div>Loading SEO settings...</div>;
  }

  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto px-4">
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
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Button onClick={generateRobotsTxt} className="flex items-center gap-2 w-full sm:w-auto text-sm">
              <Bot className="h-4 w-4" />
              Generate robots.txt
            </Button>
            <Button onClick={generateSitemapXml} className="flex items-center gap-2 w-full sm:w-auto text-sm">
              <FileDown className="h-4 w-4" />
              Generate sitemap.xml
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
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
