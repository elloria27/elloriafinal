import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutTimeline } from "@/components/about/AboutTimeline";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-accent-purple/5 to-white">
      <Header />
      <AboutHero />
      <AboutValues />
      <AboutTeam />
      <AboutTimeline />
      <Footer />
    </div>
  );
}