import { motion } from "framer-motion";
import { AboutCustomerImpactContent } from "@/types/content-blocks";
import { Users, Star, Heart } from "lucide-react";

interface AboutCustomerImpactProps {
  content?: AboutCustomerImpactContent;
}

const defaultContent: AboutCustomerImpactContent = {
  stats: [
    {
      value: "1M+",
      label: "Happy Customers"
    },
    {
      value: "4.9",
      label: "Average Rating"
    },
    {
      value: "96%",
      label: "Would Recommend"
    }
  ],
  testimonials: [
    {
      quote: "Elloria's products have completely changed my perspective on sustainable feminine care.",
      author: "Sarah M.",
      role: "Loyal Customer",
      rating: 5
    },
    {
      quote: "Not only are their products eco-friendly, but they're also incredibly comfortable and reliable.",
      author: "Emily R.",
      role: "Customer Since 2021",
      rating: 5
    },
    {
      quote: "I love knowing that my choice in feminine care products is making a positive impact on the environment.",
      author: "Jessica L.",
      role: "Environmental Advocate",
      rating: 5
    }
  ]
};

export const AboutCustomerImpact = ({ content = defaultContent }: AboutCustomerImpactProps) => {
  const { stats, testimonials } = content;

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Customer Impact</h2>
          <p className="text-xl text-gray-600">
            Our customers are at the heart of everything we do. Here's what they have to say about their experience with Elloria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                {index === 0 ? <Users className="w-8 h-8 text-primary" /> : index === 1 ? <Star className="w-8 h-8 text-primary" /> : <Heart className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
