
import Navbar from "@/components/landing page/Navbar";
import HeroSection from "@/components/landing page/HeroSection";
import CTA from "@/components/landing page/CTA";
import TimeLineSection from "@/components/landing page/TimeLineSection";
import RecruiterSection from "@/components/landing page/RecruiterSection";
import FeaturesSection from "@/components/landing page/FeaturesSection";
import StatsSection from "@/components/landing page/StatsSection";

export default function Home() {
  return (
    <>
     
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <RecruiterSection />
      <TimeLineSection />
      <CTA />
      
    </>
  );
}