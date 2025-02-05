import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { DonationFAQProps } from "@/types/content-blocks";

export const DonationFAQ = ({ content }: DonationFAQProps) => {
  const faqs = content.faqs || [
    {
      question: "Where does my donation go?",
      answer: "Your donation directly supports our program to provide essential hygiene products to women and girls in need. We work with local partners to ensure efficient distribution."
    },
    {
      question: "Are donations tax-deductible?",
      answer: "Yes, all donations are tax-deductible. You will receive a receipt for your contribution that can be used for tax purposes."
    },
    {
      question: "How do I know my contribution makes a difference?",
      answer: "We regularly share impact reports and stories from beneficiaries. You can also opt in to receive updates about how your donation is helping communities."
    },
    {
      question: "Can I make a recurring donation?",
      answer: "Yes, you can set up monthly donations to provide ongoing support. This helps us plan and maintain consistent support for our beneficiaries."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.title || "Frequently Asked Questions"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description || "Find answers to common questions about our donation program."}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};