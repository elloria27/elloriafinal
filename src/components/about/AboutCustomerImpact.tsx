import { motion } from "framer-motion";
import { Heart, Star, Users } from "lucide-react";

const testimonials = [
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
];

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "1M+",
    label: "Happy Customers"
  },
  {
    icon: <Star className="w-8 h-8" />,
    value: "4.9",
    label: "Average Rating"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    value: "96%",
    label: "Would Recommend"
  }
];

export const AboutCustomerImpact = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-accent-purple/5 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Making a Difference</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our customers are at the heart of everything we do. Here's what they have to say 
            about their experience with Elloria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center p-6"
            >
              <div className="text-primary mb-4 flex justify-center">{stat.icon}</div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
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
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex gap-1 text-primary mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
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