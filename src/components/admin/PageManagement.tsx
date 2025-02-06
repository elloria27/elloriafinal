import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const PageManagement = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error("Failed to fetch pages");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    try {
      const { error } = await supabase
        .from('pages')
        .update({
          title: editingPage.title,
          slug: editingPage.slug,
          is_published: editingPage.is_published,
          show_in_header: editingPage.show_in_header,
          show_in_footer: editingPage.show_in_footer,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPage.id);

      if (error) throw error;

      toast.success("Page updated successfully");
      setDialogOpen(false);
      fetchPages();
    } catch (error) {
      console.error('Error updating page:', error);
      toast.error("Failed to update page");
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      toast.success("Page deleted successfully");
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error("Failed to delete page");
    }
  };

  const handleViewPage = (slug: string) => {
    navigate(`/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pages</h2>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{page.title}</h3>
                  <p className="text-sm text-gray-500">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewPage(page.slug)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPage(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {editingPage && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Page</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdatePage} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={editingPage.title}
                              onChange={(e) =>
                                setEditingPage({
                                  ...editingPage,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                              id="slug"
                              value={editingPage.slug}
                              onChange={(e) =>
                                setEditingPage({
                                  ...editingPage,
                                  slug: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="published">Published</Label>
                            <Switch
                              id="published"
                              checked={editingPage.is_published}
                              onCheckedChange={(checked) =>
                                setEditingPage({
                                  ...editingPage,
                                  is_published: checked,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="showHeader">Show in Header</Label>
                            <Switch
                              id="showHeader"
                              checked={editingPage.show_in_header}
                              onCheckedChange={(checked) =>
                                setEditingPage({
                                  ...editingPage,
                                  show_in_header: checked,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="showFooter">Show in Footer</Label>
                            <Switch
                              id="showFooter"
                              checked={editingPage.show_in_footer}
                              onCheckedChange={(checked) =>
                                setEditingPage({
                                  ...editingPage,
                                  show_in_footer: checked,
                                })
                              }
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Update Page
                          </Button>
                        </form>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};