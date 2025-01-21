import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Heart, 
  Leaf, 
  Globe, 
  Award, 
  Users, 
  Calendar,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const timeline = [
  {
    year: "2019",
    title: "Our Journey Begins",
    description: "Founded with a mission to revolutionize feminine care"
  },
  {
    year: "2020",
    title: "Eco Innovation",
    description: "Launched our first biodegradable product line"
  },
  {
    year: "2021",
    title: "Global Expansion",
    description: "Reached 50+ countries worldwide"
  },
  {
    year: "2022",
    title: "Sustainability Award",
    description: "Recognized for environmental leadership"
  },
  {
    year: "2023",
    title: "Community Impact",
    description: "Provided products to 1M+ women in need"
  }
];

const team = [
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
];

const achievements = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Impact",
    stat: "50+",
    description: "Countries Reached"
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Eco-Friendly",
    stat: "100%",
    description: "Biodegradable Products"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Customer Love",
    stat: "1M+",
    description: "Happy Customers"
  }
];

const values = [
  {
    title: "Empowerment Through Comfort",
    description: "We believe every woman deserves to feel confident and comfortable, every day of the month."
  },
  {
    title: "Sustainable Innovation",
    description: "Creating products that care for both you and our planet."
  },
  {
    title: "Transparency & Trust",
    description: "Open communication about our products, processes, and impact."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-accent-purple/5 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Empowering Women Through Innovation
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              We're on a mission to revolutionize feminine care with sustainable, 
              comfortable, and reliable products that put you first.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-accent-purple/10 to-accent-peach/10">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 text-primary">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-gray-600">Milestones that shaped who we are today</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex gap-6 mb-12 relative"
              >
                <div className="w-24 flex-shrink-0 pt-1">
                  <span className="text-2xl font-bold text-primary">{item.year}</span>
                </div>
                <div className="flex-grow bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-accent-green/10 to-accent-purple/10">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600">The passionate people behind Elloria</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="mb-6 relative"
                >
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600">Making a difference in women's lives</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                >
                  {achievement.icon}
                </motion.div>
                <h3 className="text-4xl font-bold mb-2 text-primary">
                  {achievement.stat}
                </h3>
                <p className="text-xl font-semibold mb-2">{achievement.title}</p>
                <p className="text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Video Section */}
      <section className="py-20 bg-gradient-to-r from-accent-peach/10 to-accent-purple/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Our Mission"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}