import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { getSession } from "@/lib/auth";
import FeaturesSection from "@/components/FeaturesSection";
import DestinationsSection from "@/components/DestinationsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default async function Home() {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <DestinationsSection />
        <HowItWorksSection />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </>
  );
}
