import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Recycle, TreePine, PackageCheck, Factory, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContentBlock, SustainabilityContent } from "@/types/content-blocks";

const defaultContent: SustainabilityContent = {
  title: "Caring for Women, Caring for the Planet",
  subtitle: "Discover how Elloria is leading the way in sustainable feminine care",
  stats: [
    {
      icon: "Leaf",
      value: "72%",
      label: "Recyclable Materials",
      description: "Our products are made with eco-friendly, biodegradable materials"
    },
    {
      icon: "PackageCheck",
      value: "25%",
      label: "Less Packaging",
      description: "Reduction in packaging waste through innovative design"
    },
    {
      icon: "Globe",
      value: "10K+",
      label: "Kg Waste Saved",
      description: "Annual waste reduction through sustainable practices"
    }
  ],
  materials: [
    {
      icon: "TreePine",
      title: "Perforated Dry Surface",
      description: "Eco-friendly top layer for maximum comfort"
    },
    {
      icon: "Recycle",
      title: "SAP Paper",
      description: "Sustainable absorbent core material"
    },
    {
      icon: "Factory",
      title: "Air-laid Paper",
      description: "Biodegradable internal layer"
    }
  ],
  faqs: [
    {
      question: "Are Elloria pads biodegradable?",
      answer: "Our pads are made with 72% recyclable materials and we're constantly working to increase this percentage. While not fully biodegradable yet, we're committed to developing more eco-friendly solutions."
    },
    {
      question: "How should I dispose of used pads?",
      answer: "We recommend wrapping used pads in their original wrapper or recycled paper before disposing. The packaging can be recycled separately."
    },
    {
      question: "What makes Elloria different from other brands?",
      answer: "Elloria combines premium quality with environmental responsibility. Our products use 72% recyclable materials, minimal packaging, and are produced in facilities that prioritize sustainable practices."
    }
  ],
  cta: {
    title: "Join Our Sustainable Journey",
    description: "Subscribe to our newsletter for updates on our latest sustainability initiatives and eco-friendly products.",
    buttonText: "Discover Our Eco-Friendly Products",
    buttonUrl: "/shop"
  }
};

const getIconComponent = (iconName: string) => {
  const icons = {
    Leaf,
    Recycle,
    TreePine,
    PackageCheck,
    Factory,
    Globe
  };
  return icons[iconName as keyof typeof icons] || Leaf;
};

const SustainabilityPage = () => {
  const [content, setContent] = useState<SustainabilityContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('Fetching sustainability page content');
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'sustainability')
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          return;
        }

        if (!pageData?.id) {
          console.log('No sustainability page found');
          return;
        }

        console.log('Found page ID:', pageData.id);

        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .eq('type', 'sustainability')
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          return;
        }

        console.log('Fetched content blocks:', blocks);

        if (blocks && blocks.length > 0) {
          const sustainabilityBlock = blocks[0];
          setContent(sustainabilityBlock.content as SustainabilityContent);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-b from-accent-green/30 to-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"
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
              {content.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            {content.subtitle}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.stats?.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-primary mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
                  <p className="text-gray-600">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20 bg-accent-green/10">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {content.materials?.map((material, index) => {
              const IconComponent = getIconComponent(material.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-primary mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
                  <p className="text-gray-600">{material.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {content.faqs?.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-accent-green/10 to-white">
        <div className="container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">{content.cta?.title}</h2>
            <p className="text-gray-600 mb-8">{content.cta?.description}</p>
            <Link
              to={content.cta?.buttonUrl || "/shop"}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              {content.cta?.buttonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityPage;