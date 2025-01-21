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
  CheckCircle,
  Sparkles,
  Flower
} from "lucide-react";

const timeline = [
  {
    year: "2019",
    title: "Our Journey Begins",
    description: "Founded with a vision to revolutionize feminine care through innovation and understanding"
  },
  {
    year: "2020",
    title: "Eco Innovation",
    description: "Launched our first line of biodegradable products, setting new industry standards"
  },
  {
    year: "2021",
    title: "Global Impact",
    description: "Expanded to 50+ countries, touching lives of millions of women worldwide"
  },
  {
    year: "2022",
    title: "Sustainability Award",
    description: "Recognized globally for our commitment to environmental responsibility"
  },
  {
    year: "2023",
    title: "Community First",
    description: "Provided essential products to over 1 million women in underserved communities"
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    quote: "Every woman deserves comfort and confidence, every day of the month.",
    image: "/lovable-uploads/42c0dc8a-d937-4255-9c12-d484082d26e6.png"
  },
  {
    name: "Dr. Emily Chen",
    role: "Head of Research",
    quote: "Innovation in feminine care starts with understanding women's needs.",
    image: "/lovable-uploads/3780f868-91c7-4512-bc4c-6af150baf90d.png"
  },
  {
    name: "Maria Rodriguez",
    role: "Sustainability Director",
    quote: "Creating products that care for both women and our planet.",
    image: "/lovable-uploads/bf47f5ff-e31b-4bdc-8ed0-5c0fc3d5f0d1.png"
  }
];

const achievements = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Reach",
    stat: "50+",
    description: "Countries Served"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Lives Touched",
    stat: "1M+",
    description: "Happy Customers"
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Eco-Impact",
    stat: "100%",
    description: "Biodegradable"
  }
];

const values = [
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: "Comfort First",
    description: "We believe every woman deserves to feel confident and comfortable, every day."
  },
  {
    icon: <Leaf className="w-6 h-6 text-primary" />,
    title: "Sustainable Care",
    description: "Creating products that care for both you and our planet."
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: "Women's Health",
    description: "Committed to improving women's health through innovation and education."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-accent-purple/5 to-white">
      <Header />
      
      {/* Hero Section with Video */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-accent-peach/20 to-accent-purple/20">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Empowering Women Through
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  Innovative Care
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                We're revolutionizing feminine care with sustainable, comfortable, and reliable products 
                that put your comfort and confidence first.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Our Mission"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              />
            </motion.div>
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
                <div className="w-12 h-12 bg-accent-purple/10 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-r from-accent-green/10 to-accent-peach/10">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600">Making a difference in women's lives globally</p>
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
                  className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                >
                  {achievement.icon}
                </motion.div>
                <h3 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {achievement.stat}
                </h3>
                <p className="text-xl font-semibold mb-2">{achievement.title}</p>
                <p className="text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
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
            {team.map((member, index) => (
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary mb-4">{member.role}</p>
                <p className="text-gray-600 italic">&quot;{member.quote}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-r from-accent-purple/10 to-accent-peach/10">
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
                <div className="w-32 flex-shrink-0 pt-1">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {item.year}
                  </span>
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

      <Footer />
    </div>
  );
}