import { Header } from "@/components/Header";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutSustainability } from "@/components/about/AboutSustainability";
import { AboutCustomerImpact } from "@/components/about/AboutCustomerImpact";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutHeroSection />
      <AboutMission />
      <AboutSustainability />
      <AboutTeam />
      <AboutCustomerImpact />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#0094F4] to-[#9b87f5] text-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Be Part of the Elloria Movement
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
                Sign Up for Updates <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}