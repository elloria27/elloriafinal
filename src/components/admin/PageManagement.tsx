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
import { toast } from "sonner";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: Json;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const PageManagement = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  useEffect(() => {
    checkAuthAndFetchPages();
  }, []);

  const checkAuthAndFetchPages = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error("Authentication error");
        return;
      }

      if (!session) {
        console.log('No active session');
        toast.error("Please sign in to access the admin panel");
        return;
      }

      console.log('Session found, checking admin status');
      
      const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });

      if (isAdminError) {
        console.error('Error checking admin status:', isAdminError);
        toast.error("Error verifying admin access");
        return;
      }

      if (!isAdminData) {
        console.log('User is not an admin');
        toast.error("Admin access required");
        return;
      }

      console.log('Admin status confirmed, fetching pages');
      await fetchPages();

    } catch (error) {
      console.error('Error in auth check:', error);
      toast.error("Error checking authentication");
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_fetch_all_pages');
      
      if (error) {
        console.error('Error fetching pages:', error);
        toast.error("Error loading pages");
        return;
      }

      console.log('Pages fetched successfully:', data);
      setPages(data || []);
    } catch (error) {
      console.error('Error in fetchPages:', error);
      toast.error("Error loading pages");
    }
  };

  const handleCreatePage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const newPage = {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        content: [],
        is_published: false
      };

      console.log('Creating new page:', newPage);
      
      const { error } = await supabase
        .from('pages')
        .insert([newPage]);

      if (error) throw error;

      toast.success("Page created successfully");
      setIsNewDialogOpen(false);
      await fetchPages();
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error("Failed to create page");
    }
  };

  const handleUpdatePage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPage) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        is_published: formData.get('is_published') === 'on',
        updated_at: new Date().toISOString(),
      };

      console.log('Updating page:', updates);

      const { error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', selectedPage.id);

      if (error) throw error;

      toast.success("Page updated successfully");
      setIsEditDialogOpen(false);
      await fetchPages();
    } catch (error) {
      console.error('Error updating page:', error);
      toast.error("Failed to update page");
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      toast.success("Page deleted successfully");
      await fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error("Failed to delete page");
    }
  };

  if (loading) {
    return <div>Loading pages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Page Management</h2>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL</Label>
                <Input
                  id="slug"
                  name="slug"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Page
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>{page.is_published ? 'Published' : 'Draft'}</TableCell>
              <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Page</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdatePage} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            defaultValue={selectedPage?.title}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug">URL</Label>
                          <Input
                            id="slug"
                            name="slug"
                            defaultValue={selectedPage?.slug}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_published"
                            name="is_published"
                            defaultChecked={selectedPage?.is_published}
                          />
                          <Label htmlFor="is_published">Published</Label>
                        </div>
                        <Button type="submit" className="w-full">
                          Save Changes
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePage(page.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
