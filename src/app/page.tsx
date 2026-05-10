import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DestinationsSection from "@/components/DestinationsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DestinationsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
