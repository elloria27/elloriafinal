import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Leaf, Shield, Users, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutSustainability } from "@/components/about/AboutSustainability";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutCustomerImpact } from "@/components/about/AboutCustomerImpact";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <AboutHeroSection 
        content={{
          title: "Redefining Comfort & Care for Everyone",
          subtitle: "At Elloria, we create innovative personal care products designed for comfort, confidence, and reliability.",
          backgroundImage: "/lovable-uploads/7a6b700f-4122-4c0b-ae5b-519bbf08e94a.png"
        }}
      />

      {/* Story Section */}
      <AboutStory 
        content={{
          title: "Our Story",
          subtitle: "A Journey of Innovation and Care",
          content: "Founded with a vision to revolutionize personal care through sustainable innovation, Elloria began its journey to create products that care for both you and our planet. We believe in inclusivity and creating solutions that cater to diverse needs while maintaining the highest standards of quality and comfort.",
          image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png"
        }}
      />

      {/* Values Section */}
      <AboutValues />

      {/* Sustainability Section */}
      <AboutSustainability 
        content={{
          title: "Our Commitment to Sustainability",
          description: "We believe in creating products that care for both you and our planet. Our sustainable practices are at the core of everything we do.",
          stats: [
            {
              value: "55%",
              label: "Recyclable Materials"
            },
            {
              value: "95%",
              label: "Recyclable Packaging"
            },
            {
              value: "100%",
              label: "Eco-Friendly Production"
            }
          ]
        }}
      />

      {/* Team Section */}
      <AboutTeam 
        content={{
          title: "Meet Our Team",
          subtitle: "The passionate people behind our mission",
          members: [
            {
              name: "Sarah Johnson",
              role: "Founder & CEO",
              image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
              bio: "Leading the vision for sustainable feminine care"
            },
            {
              name: "Dr. Emily Chen",
              role: "Head of Research",
              image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
              bio: "Driving innovation in product development"
            },
            {
              name: "Maria Rodriguez",
              role: "Sustainability Director",
              image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
              bio: "Ensuring eco-friendly practices"
            }
          ]
        }}
      />

      {/* Customer Impact Section */}
      <AboutCustomerImpact />

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
              Experience the perfect blend of comfort, protection, and sustainability.
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