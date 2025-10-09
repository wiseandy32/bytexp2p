import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import BestPractices from "@/components/BestPractices";
import TrustedGlobally from "@/components/TrustedGlobally";
import JoinExchange from "@/components/JoinExchange";
import Reviews from "@/components/Reviews";
import { Twitter, Linkedin, Facebook } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <HowItWorks />
      <BestPractices />
      <TrustedGlobally />
      <JoinExchange />
      <Reviews />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-xl mx-auto">
            <form className="bg-gray-900 rounded-xl p-8">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
                <input type="text" id="name" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                <input type="email" id="email" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                <textarea id="message" rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"></textarea>
              </div>
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="hover:text-white"><Twitter /></a>
            <a href="#" className="hover:text-white"><Linkedin /></a>
            <a href="#" className="hover:text-white"><Facebook /></a>
          </div>
          <p>&copy; 2024 PEERSHIELDEX. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
