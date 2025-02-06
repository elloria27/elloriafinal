import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { PageComponent } from "@/types/page-builder";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactBusinessContent } from "@/types/content-blocks";

export const Contact = () => {
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: pageData } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'contact')
          .single();

        if (pageData) {
          const { data: componentsData } = await supabase
            .from('page_components')
            .select('*')
            .eq('page_id', pageData.id)
            .order('order');

          if (componentsData) {
            const typedComponents: PageComponent[] = componentsData.map((component: any) => ({
              id: component.id,
              type: component.type,
              content: component.content,
              order: component.order_index,
              settings: component.settings || {}
            }));
            setComponents(typedComponents);
          }
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageBuilder components={components} />
    </div>
  );
};

export default Contact;