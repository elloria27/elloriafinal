import { motion } from "framer-motion";
import { ArrowRight, Leaf, Recycle, TreePine, PackageCheck, Factory, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SustainabilityPage = () => {
  const stats = [
    {
      icon: <Leaf className="w-8 h-8" />,
      value: "72%",
      label: "Recyclable Materials",
      description: "Our products are made with eco-friendly, biodegradable materials"
    },
    {
      icon: <PackageCheck className="w-8 h-8" />,
      value: "25%",
      label: "Less Packaging",
      description: "Reduction in packaging waste through innovative design"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: "10K+",
      label: "Kg Waste Saved",
      description: "Annual waste reduction through sustainable practices"
    }
  ];

  const materials = [
    {
      icon: <TreePine className="w-6 h-6" />,
      title: "Perforated Dry Surface",
      description: "Eco-friendly top layer for maximum comfort"
    },
    {
      icon: <Recycle className="w-6 h-6" />,
      title: "SAP Paper",
      description: "Sustainable absorbent core material"
    },
    {
      icon: <Factory className="w-6 h-6" />,
      title: "Air-laid Paper",
      description: "Biodegradable internal layer"
    }
  ];

  const faqs = [
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
  ];

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
              Caring for Women, Caring for the Planet
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover how Elloria is leading the way in sustainable feminine care
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

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Our Sustainability Mission</h2>
            <p className="text-gray-600 mb-12">
              "At Elloria, we believe that premium feminine care shouldn't come at the cost of our planet. 
              Our mission is to revolutionize the industry with sustainable solutions that protect both women and the environment."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-primary mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
                <p className="text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20 bg-accent-green/10">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Sustainable Materials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our products are crafted with carefully selected materials that minimize environmental impact 
              while maintaining the highest standards of comfort and protection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {materials.map((material, index) => (
              <motion.div
                key={material.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="text-primary mb-4">{material.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
                <p className="text-gray-600">{material.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our sustainable practices and products.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
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
            <h2 className="text-4xl font-bold mb-6">Join Our Sustainable Journey</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for updates on our latest sustainability initiatives and eco-friendly products.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Discover Our Eco-Friendly Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityPage;