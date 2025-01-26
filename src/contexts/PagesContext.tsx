import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Page = {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  menu_type: 'main' | 'submenu';
  parent_id: string | null;
  menu_order: number;
}

type PagesContextType = {
  publishedPages: Page[];
  isLoading: boolean;
}

const PagesContext = createContext<PagesContextType>({
  publishedPages: [],
  isLoading: true,
});

export const PagesProvider = ({ children }: { children: React.ReactNode }) => {
  const [publishedPages, setPublishedPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data: pages, error } = await supabase
          .from('pages')
          .select('id, slug, title, is_published, show_in_header, show_in_footer, menu_type, parent_id, menu_order')
          .order('created_at');

        if (error) {
          console.error('Error fetching pages:', error);
          return;
        }

        // Transform the data to ensure menu_type is correctly typed
        const typedPages: Page[] = (pages || []).map(page => ({
          ...page,
          menu_type: page.menu_type as 'main' | 'submenu'
        }));

        setPublishedPages(typedPages);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pages' },
        () => {
          fetchPages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <PagesContext.Provider value={{ publishedPages, isLoading }}>
      {children}
    </PagesContext.Provider>
  );
};

export const usePages = () => useContext(PagesContext);