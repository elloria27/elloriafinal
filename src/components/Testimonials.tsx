import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TestimonialsContent } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";

interface TestimonialsProps {
  content?: TestimonialsContent;
}

interface Testimonial {
  name: string;
  rating: number;
  text: string;
  source: string;
}

const defaultTestimonials: Testimonial[] = [
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

const sourceOptions = [
  "Verified Purchase",
  "Facebook", 
  "Instagram",
  "Google",
  "TikTok"
];

export const Testimonials = ({ content }: TestimonialsProps) => {
  console.log('Testimonials content:', content);
  
  let testimonials: Testimonial[] = defaultTestimonials;
  
  if (content) {
    if (Array.isArray(content.testimonials)) {
      testimonials = content.testimonials.map((item): Testimonial => {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, Json>;
          const source = String(itemObj.source || '');
          // Validate source is from allowed options
          const validSource = sourceOptions.includes(source) ? source : sourceOptions[0];
          
          return {
            name: String(itemObj.name || itemObj.author || ''),
            rating: Math.min(Math.max(Number(itemObj.rating || 5), 1), 5), // Ensure rating is between 1-5
            text: String(itemObj.text || itemObj.content || ''),
            source: validSource
          };
        }
        return {
          name: '',
          rating: 5,
          text: typeof item === 'string' ? item : '',
          source: sourceOptions[0]
        };
      });
    } else if (Array.isArray(content.items)) {
      testimonials = content.items.map((item): Testimonial => {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, Json>;
          const source = String(itemObj.source || '');
          const validSource = sourceOptions.includes(source) ? source : sourceOptions[0];
          
          return {
            name: String(itemObj.name || itemObj.author || ''),
            rating: Math.min(Math.max(Number(itemObj.rating || 5), 1), 5),
            text: String(itemObj.text || itemObj.content || ''),
            source: validSource
          };
        }
        return {
          name: '',
          rating: 5,
          text: typeof item === 'string' ? item : '',
          source: sourceOptions[0]
        };
      });
    } else if (typeof content.testimonials === 'object' && content.testimonials !== null) {
      const testimonialsObj = content.testimonials as Record<string, Json>;
      testimonials = Object.values(testimonialsObj).map((item): Testimonial => {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, Json>;
          const source = String(itemObj.source || '');
          const validSource = sourceOptions.includes(source) ? source : sourceOptions[0];
          
          return {
            name: String(itemObj.name || itemObj.author || ''),
            rating: Math.min(Math.max(Number(itemObj.rating || 5), 1), 5),
            text: String(itemObj.text || itemObj.content || ''),
            source: validSource
          };
        }
        return {
          name: '',
          rating: 5,
          text: typeof item === 'string' ? item : '',
          source: sourceOptions[0]
        };
      });
    }
  }
  
  console.log('Processed testimonials:', testimonials);

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