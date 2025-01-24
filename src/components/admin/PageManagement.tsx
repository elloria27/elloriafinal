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
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      console.log('Starting to fetch pages...');
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', sessionData?.session ? 'Active session found' : 'No active session');
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error("Помилка аутентифікації");
        return;
      }

      if (!sessionData.session) {
        console.log('No active session found');
        toast.error("Будь ласка, увійдіть в систему для доступу до адмін-панелі");
        return;
      }

      // Викликаємо функцію admin_fetch_all_pages
      const { data, error } = await supabase.rpc('admin_fetch_all_pages');
      console.log('Response from admin_fetch_all_pages:', { data, error });

      if (error) {
        console.error('Error fetching pages:', error);
        if (error.message.includes('Access denied')) {
          toast.error("Доступ заборонено: потрібні права адміністратора");
        } else {
          toast.error("Помилка при завантаженні сторінок");
        }
        return;
      }

      if (!data) {
        console.log('No pages data returned');
        setPages([]);
        return;
      }

      console.log('Pages fetched successfully:', data);
      setPages(data);
    } catch (error) {
      console.error('Error in fetchPages:', error);
      toast.error("Помилка при завантаженні сторінок");
    } finally {
      setLoading(false);
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
    return <div>Завантаження сторінок...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управління сторінками</h2>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Додати нову сторінку
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Створити нову сторінку</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  name="title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL-адреса</Label>
                <Input
                  id="slug"
                  name="slug"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Створити сторінку
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Заголовок</TableHead>
            <TableHead>URL-адреса</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Останнє оновлення</TableHead>
            <TableHead>Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>{page.is_published ? 'Опубліковано' : 'Чернетка'}</TableCell>
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
                        <DialogTitle>Редагувати сторінку</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdatePage} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Заголовок</Label>
                          <Input
                            id="title"
                            name="title"
                            defaultValue={selectedPage?.title}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug">URL-адреса</Label>
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
                          <Label htmlFor="is_published">Опубліковано</Label>
                        </div>
                        <Button type="submit" className="w-full">
                          Зберегти зміни
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