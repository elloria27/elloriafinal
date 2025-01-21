import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Leaf, Users, Star, Award, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/30 to-accent-peach/30" />
        <div 
          className="absolute inset-0 bg-[url('/lovable-uploads/a7e9335a-6251-4ad6-9140-b04479d11e77.png')] bg-cover bg-center"
          style={{ backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Redefining Care
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Creating innovative solutions that prioritize your comfort and well-being
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We believe every woman deserves products that understand her needs, 
                respect her body, and care for the environment. Our journey began with 
                a simple idea: to create feminine care products that combine comfort, 
                innovation, and sustainability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-16 bg-gradient-to-b from-accent-purple/10 to-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="w-8 h-8" />, stat: "1M+", label: "Women Empowered" },
              { icon: <Globe className="w-8 h-8" />, stat: "50+", label: "Countries Reached" },
              { icon: <Star className="w-8 h-8" />, stat: "95%", label: "Customer Satisfaction" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-primary mb-4">{item.icon}</div>
                <h3 className="text-4xl font-bold mb-2">{item.stat}</h3>
                <p className="text-gray-600">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Care First",
                description: "Your comfort and well-being are our top priorities"
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: "Sustainability",
                description: "Committed to protecting our planet for future generations"
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Excellence",
                description: "Continuously innovating to provide the best solutions"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transform -skew-y-12" />
                <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gradient-to-r from-accent-purple/10 to-accent-peach/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Our Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600">The passionate people behind our mission</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                image: "/lovable-uploads/42c0dc8a-d937-4255-9c12-d484082d26e6.png"
              },
              {
                name: "Dr. Emily Chen",
                role: "Head of Research",
                image: "/lovable-uploads/3780f868-91c7-4512-bc4c-6af150baf90d.png"
              },
              {
                name: "Maria Rodriguez",
                role: "Sustainability Director",
                image: "/lovable-uploads/bf47f5ff-e31b-4bdc-8ed0-5c0fc3d5f0d1.png"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-6 inline-block"
                >
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">Join Our Journey</h2>
              <p className="text-xl mb-8">
                Be part of our mission to revolutionize feminine care
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-opacity-90 transition-colors"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}