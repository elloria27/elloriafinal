import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Page = {
  slug: string;
  title: string;
  is_published: boolean;
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
          .select('slug, title, is_published')
          .order('created_at');

        if (error) {
          console.error('Error fetching pages:', error);
          return;
        }

        setPublishedPages(pages || []);
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