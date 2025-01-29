import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Leaf, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/lovable-uploads/7a6b700f-4122-4c0b-ae5b-519bbf08e94a.png')",
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="container px-4 text-center">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Empowering Every Woman
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Creating innovative solutions for feminine care that prioritize comfort, 
              confidence, and sustainability
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
              >
                Learn More
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-white via-accent-purple/5 to-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in creating products that not only meet the highest standards of quality 
              but also contribute to a sustainable future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Care & Comfort",
                description: "Prioritizing your comfort and well-being with every product we create"
              },
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Sustainability",
                description: "Committed to eco-friendly practices and materials in everything we do"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Quality First",
                description: "Ensuring the highest standards of quality and safety in our products"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
                <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    <div className="text-primary">{value.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gradient-to-b from-accent-purple/5 via-white to-accent-peach/5">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Making a Difference in
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  Women's Lives
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Through innovative products and sustainable practices, we're revolutionizing 
                feminine care while protecting our planet for future generations.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-4xl font-bold text-primary mb-2">1M+</h3>
                  <p className="text-gray-600">Women Empowered</p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-primary mb-2">72%</h3>
                  <p className="text-gray-600">Recyclable Materials</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png"
                  alt="Impact"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-accent-peach/5 to-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals dedicated to revolutionizing feminine care through 
              innovation and sustainability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
                quote: "Every woman deserves comfort and confidence."
              },
              {
                name: "Dr. Emily Chen",
                role: "Head of Research",
                image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
                quote: "Innovation starts with understanding needs."
              },
              {
                name: "Maria Rodriguez",
                role: "Sustainability Director",
                image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
                quote: "Creating a better future for our planet."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className="relative mb-6 overflow-hidden rounded-3xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary mb-4">{member.role}</p>
                <p className="text-gray-600 italic">"{member.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Elloria Movement
            </h2>
            <p className="text-xl mb-8">
              Together, we can redefine feminine care and make a positive impact on the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
              >
                Shop Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20"
              >
                Learn More <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}