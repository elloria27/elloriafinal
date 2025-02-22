
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Page = {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  parent_id: string | null;
  menu_order: number;
  menu_type: string;
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
        if (!supabase) {
          console.log('Supabase client not configured yet');
          setIsLoading(false);
          return;
        }

        const { data: pages, error } = await supabase
          .from('pages')
          .select('id, slug, title, is_published, show_in_header, show_in_footer, parent_id, menu_order, menu_type')
          .order('menu_order');

        if (error) {
          console.error('Error fetching pages:', error);
          return;
        }

        console.log('Fetched pages:', pages); // Debug log
        setPublishedPages(pages || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();

    // Only set up realtime subscription if supabase is configured
    let channel: any;
    
    if (supabase) {
      channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'pages' },
          () => {
            fetchPages();
          }
        )
        .subscribe();
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <PagesContext.Provider value={{ publishedPages, isLoading }}>
      {children}
    </PagesContext.Provider>
  );
};

export const usePages = () => useContext(PagesContext);
