import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutBanner } from "@/components/about/AboutBanner";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutParallax } from "@/components/about/AboutParallax";
import { AnimatedIcons } from "@/components/about/AnimatedIcons";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutTimeline } from "@/components/about/AboutTimeline";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutBanner />
      <AboutHero />
      <AnimatedIcons />
      <AboutParallax />
      <AboutTeam />
      <AboutTimeline />
      <Footer />
    </div>
  );
}