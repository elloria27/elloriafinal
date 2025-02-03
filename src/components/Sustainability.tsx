import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Recycle, Globe, TreePine, Factory, PackageCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SustainabilitySection, SustainabilityHeroContent, SustainabilityMissionContent, SustainabilityMaterialsContent, SustainabilityFAQContent, SustainabilityCTAContent } from "@/types/sustainability";

interface SustainabilityProps {
  pageId?: string;
}

export const Sustainability = ({ pageId }: SustainabilityProps) => {
  const [sections, setSections] = useState<SustainabilitySection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        console.log('Fetching sustainability sections for page:', pageId);
        
        const { data, error } = await supabase
          .from('sustainability_sections')
          .select('*')
          .eq('page_id', pageId)
          .order('order_index');

        if (error) {
          console.error('Error fetching sustainability sections:', error);
          throw error;
        }

        console.log('Fetched sustainability sections:', data);
        
        // Transform the data to ensure correct typing
        const typedSections = data?.map(section => ({
          ...section,
          content: section.content as unknown as (
            SustainabilityHeroContent | 
            SustainabilityMissionContent | 
            SustainabilityMaterialsContent | 
            SustainabilityFAQContent | 
            SustainabilityCTAContent
          )
        })) || [];

        setSections(typedSections);
      } catch (error) {
        console.error('Failed to fetch sustainability sections:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchSections();
    }
  }, [pageId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isHeroSection = (content: any): content is SustainabilityHeroContent => {
    return 'background_image' in content;
  };

  const isMissionSection = (content: any): content is SustainabilityMissionContent => {
    return 'stats' in content;
  };

  const isMaterialsSection = (content: any): content is SustainabilityMaterialsContent => {
    return 'materials' in content;
  };

  const isFAQSection = (content: any): content is SustainabilityFAQContent => {
    return 'faqs' in content;
  };

  const isCTASection = (content: any): content is SustainabilityCTAContent => {
    return 'button_text' in content && 'button_link' in content;
  };

  const renderSection = (section: SustainabilitySection) => {
    switch (section.section_type) {
      case "sustainability_hero":
        if (!isHeroSection(section.content)) return null;
        return (
          <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-b from-accent-green/30 to-white overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={section.content.background_image}
                alt="Nature background"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="container relative z-10 text-center px-4"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                  {section.content.title}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                {section.content.description}
              </p>
            </motion.div>
          </section>
        );

      case "sustainability_mission":
        if (!isMissionSection(section.content)) return null;
        return (
          <section className="py-20 bg-white">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto text-center"
              >
                <h2 className="text-4xl font-bold mb-6">{section.content.title}</h2>
                <p className="text-gray-600 mb-12">{section.content.description}</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.content.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-primary mb-4">
                      {stat.icon === 'Leaf' && <Leaf className="w-8 h-8" />}
                      {stat.icon === 'PackageCheck' && <PackageCheck className="w-8 h-8" />}
                      {stat.icon === 'Globe' && <Globe className="w-8 h-8" />}
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
                    <p className="text-gray-600">{stat.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case "sustainability_materials":
        if (!isMaterialsSection(section.content)) return null;
        return (
          <section className="py-20 bg-accent-green/10">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-6">{section.content.title}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {section.content.description}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {section.content.materials.map((material, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-primary mb-4">
                      {material.icon === 'TreePine' && <TreePine className="w-6 h-6" />}
                      {material.icon === 'Recycle' && <Recycle className="w-6 h-6" />}
                      {material.icon === 'Factory' && <Factory className="w-6 h-6" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
                    <p className="text-gray-600">{material.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case "sustainability_faq":
        if (!isFAQSection(section.content)) return null;
        return (
          <section className="py-20 bg-white">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-6">{section.content.title}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {section.content.description}
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                {section.content.faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case "sustainability_cta":
        if (!isCTASection(section.content)) return null;
        return (
          <section className="py-20 bg-gradient-to-b from-accent-green/10 to-white">
            <div className="container px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-4xl font-bold mb-6">{section.content.title}</h2>
                <p className="text-gray-600 mb-8">{section.content.description}</p>
                <a
                  href={section.content.button_link}
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
                >
                  {section.content.button_text}
                </a>
              </motion.div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {sections.map((section) => (
        <div key={section.id}>
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};