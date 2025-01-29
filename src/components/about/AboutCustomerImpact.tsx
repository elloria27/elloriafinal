import { motion } from "framer-motion";
import { AboutCustomerImpactContent } from "@/types/content-blocks";

interface AboutCustomerImpactProps {
  content?: AboutCustomerImpactContent;
}

export const AboutCustomerImpact = ({ content = {} }: AboutCustomerImpactProps) => {
  const {
    title = "Customer Impact",
    description = "Real stories from our community",
    testimonials = []
  } = content;

  return (
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-gray-600 mb-12">{description}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-6 border rounded-lg shadow-lg"
            >
              <p className="text-lg italic">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold">{testimonial.author}</p>
              {testimonial.location && <p className="text-gray-500">{testimonial.location}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
