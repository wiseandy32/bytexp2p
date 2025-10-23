import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import BestPractices from "@/components/BestPractices";
import TrustedGlobally from "@/components/TrustedGlobally";
import JoinExchange from "@/components/JoinExchange";
import Reviews from "@/components/Reviews";
import StartExchanging from "@/components/StartExchanging";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="text-white min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <HowItWorks />
      <BestPractices />
      <TrustedGlobally />
      <JoinExchange />
      <Reviews />
      <StartExchanging />
      <Footer />
    </div>
  );
}
