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
import { Edit2, Plus, Trash2, Layout } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { PageBuilder } from "./page-builder/PageBuilder";
import { ContentBlock } from "@/types/content-blocks";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: Json;
  content_blocks: ContentBlock[];
  is_published: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  created_at: string;
  updated_at: string;
  page_template?: string;
  parent_id?: string | null;
  menu_order?: number;
  menu_type?: string;
}

interface ContentBlockJson {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order_index: number;
}

export const PageManagement = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [selectedPageForEdit, setSelectedPageForEdit] = useState<Page | null>(null);

  useEffect(() => {
    console.log('PageManagement component mounted');
    checkAuthAndFetchPages();
  }, []);

  const checkAuthAndFetchPages = async () => {
    try {
      console.log('Starting auth check and page fetch process');
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

      console.log('Session found:', session.user.id);
      
      const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });

      if (isAdminError) {
        console.error('Error checking admin status:', isAdminError);
        toast.error("Error verifying admin access");
        return;
      }

      console.log('Admin status:', isAdminData);

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
      console.log('Fetching pages using admin_fetch_all_pages RPC');
      const { data, error } = await supabase.rpc('admin_fetch_all_pages');
      
      if (error) {
        console.error('Error fetching pages:', error);
        toast.error("Error loading pages");
        return;
      }

      console.log('Pages fetched successfully:', data);
      
      // Fetch content blocks for each page
      const pagesWithBlocks = await Promise.all(data.map(async (page: any) => {
        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', page.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching blocks for page:', page.id, blocksError);
          return page;
        }

        return {
          ...page,
          content_blocks: blocks || []
        };
      }));

      setPages(pagesWithBlocks);
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
        is_published: false,
        show_in_header: false,
        show_in_footer: false,
        parent_id: formData.get('parent_id')?.toString() || null,
        menu_order: parseInt(formData.get('menu_order')?.toString() || '0'),
        menu_type: formData.get('menu_type')?.toString() || 'main'
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
        show_in_header: formData.get('show_in_header') === 'on',
        show_in_footer: formData.get('show_in_footer') === 'on',
        parent_id: formData.get('parent_id')?.toString() || null,
        menu_order: parseInt(formData.get('menu_order')?.toString() || '0'),
        menu_type: formData.get('menu_type')?.toString() || 'main',
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
      // First delete all content blocks associated with the page
      const { error: blocksError } = await supabase
        .from('content_blocks')
        .delete()
        .eq('page_id', pageId);

      if (blocksError) {
        console.error('Error deleting content blocks:', blocksError);
        throw blocksError;
      }

      // Then delete the page
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

  const handleEditContent = (page: Page) => {
    console.log('Opening content editor for page:', page);
    setSelectedPageForEdit(page);
  };

  if (selectedPageForEdit) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Editing Content: {selectedPageForEdit.title}
          </h2>
          <Button
            variant="outline"
            onClick={() => setSelectedPageForEdit(null)}
          >
            Back to Pages
          </Button>
        </div>
        <PageBuilder
          pageId={selectedPageForEdit.id}
          initialBlocks={selectedPageForEdit.content_blocks || []}
        />
      </div>
    );
  }

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
              <div className="space-y-2">
                <Label htmlFor="parent_id">Parent Page</Label>
                <select
                  id="parent_id"
                  name="parent_id"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">None (Top Level)</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu_order">Menu Order</Label>
                <Input
                  id="menu_order"
                  name="menu_order"
                  type="number"
                  defaultValue="0"
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
            <TableHead>Parent</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Menu Visibility</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>
                {pages.find(p => p.id === page.parent_id)?.title || '-'}
              </TableCell>
              <TableCell>{page.menu_order || 0}</TableCell>
              <TableCell>{page.is_published ? 'Published' : 'Draft'}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {page.show_in_header && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Header</span>}
                  {page.show_in_footer && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Footer</span>}
                  {!page.show_in_header && !page.show_in_footer && <span className="text-xs text-gray-500">Hidden</span>}
                </div>
              </TableCell>
              <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditContent(page)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Layout className="h-4 w-4" />
                  </Button>

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
                        <DialogTitle>Edit Page Settings</DialogTitle>
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
                        <div className="space-y-2">
                          <Label htmlFor="parent_id">Parent Page</Label>
                          <select
                            id="parent_id"
                            name="parent_id"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            defaultValue={selectedPage?.parent_id || ''}
                          >
                            <option value="">None (Top Level)</option>
                            {pages
                              .filter(p => p.id !== selectedPage?.id)
                              .map((page) => (
                                <option key={page.id} value={page.id}>
                                  {page.title}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="menu_order">Menu Order</Label>
                          <Input
                            id="menu_order"
                            name="menu_order"
                            type="number"
                            defaultValue={selectedPage?.menu_order || 0}
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
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="show_in_header"
                            name="show_in_header"
                            defaultChecked={selectedPage?.show_in_header}
                          />
                          <Label htmlFor="show_in_header">Show in Header Menu</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="show_in_footer"
                            name="show_in_footer"
                            defaultChecked={selectedPage?.show_in_footer}
                          />
                          <Label htmlFor="show_in_footer">Show in Footer Menu</Label>
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
