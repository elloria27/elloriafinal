import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutBanner } from "@/components/about/AboutBanner";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutParallax } from "@/components/about/AboutParallax";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutValues } from "@/components/about/AboutValues";
import { AnimatedIcons } from "@/components/about/AnimatedIcons";
import { Sustainability } from "@/components/Sustainability";
import { Testimonials } from "@/components/Testimonials";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutBanner />
      <AboutHero />
      <AnimatedIcons />
      <AboutValues />
      <AboutParallax />
      <Sustainability />
      <AboutTeam />
      <AboutTimeline />
      <Testimonials />
      <Footer />
    </div>
  );
}