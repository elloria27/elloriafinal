import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TestimonialsContent } from "@/types/content-blocks";

interface TestimonialsProps {
  content?: TestimonialsContent;
}

const defaultTestimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "The most comfortable and eco-friendly products I've ever used. Highly recommend!",
    source: "Verified Purchase"
  },
  {
    name: "Emily R.",
    rating: 5,
    text: "Love that I can feel good about my choice while getting premium protection.",
    source: "Instagram"
  },
  {
    name: "Jessica K.",
    rating: 5,
    text: "Finally, a sustainable option that doesn't compromise on quality!",
    source: "TikTok"
  }
];

export const Testimonials = ({ content }: TestimonialsProps) => {
  const testimonials = content?.testimonials || defaultTestimonials;

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          {content?.title || "What Our Customers Say"}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{testimonial.name}</span>
                <span className="text-sm text-gray-500">{testimonial.source}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};