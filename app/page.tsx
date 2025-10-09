import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Globe, ShieldCheck, Server, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <Hero />

      {/* Why Choose Us Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose PeerShieldEX</h2>
          <p className="text-xl text-gray-400 text-center mb-12">PeerShieldEX is the most secure and reliable P2P crypto escrow platform.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-green-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Decentralized</h3>
              <p className="text-gray-400 text-center">
                PeerShieldEX is a decentralized platform, which means that there is no central point of failure.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-green-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Secure</h3>
              <p className="text-gray-400 text-center">
                PeerShieldEX uses a multi-signature escrow system to ensure that your funds are safe.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-green-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <Server className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Reliable</h3>
              <p className="text-gray-400 text-center">
                PeerShieldEX is a reliable platform that is available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="services" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <p className="text-xl text-gray-400 text-center mb-12">PeerShieldEX makes it easy to trade crypto with anyone in the world.</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full h-20 w-20 flex items-center justify-center text-3xl font-bold">1</div>
              <div className="ml-6 text-left">
                <h3 className="text-2xl font-bold">Create an offer</h3>
                <p className="text-gray-400">Create an offer to buy or sell crypto.</p>
              </div>
            </div>
            <div className="h-1 w-20 bg-green-500 hidden md:block"></div>
            <div className="flex items-center mt-8 md:mt-0">
              <div className="bg-green-500 rounded-full h-20 w-20 flex items-center justify-center text-3xl font-bold">2</div>
              <div className="ml-6 text-left">
                <h3 className="text-2xl font-bold">Fund the escrow</h3>
                <p className="text-gray-400">Fund the escrow with the crypto you want to trade.</p>
              </div>
            </div>
            <div className="h-1 w-20 bg-green-500 hidden md:block"></div>
            <div className="flex items-center mt-8 md:mt-0">
              <div className="bg-green-500 rounded-full h-20 w-20 flex items-center justify-center text-3xl font-bold">3</div>
              <div className="ml-6 text-left">
                <h3 className="text-2xl font-bold">Release the funds</h3>
                <p className="text-gray-400">Release the funds to the other party once you have received the crypto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">What is PeerShieldEX?</h3>
              <p className="text-gray-400">PeerShieldEX is a decentralized P2P crypto escrow platform that allows users to trade directly with each other in a secure and trustless environment.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">How does PeerShieldEX work?</h3>
              <p className="text-gray-400">PeerShieldEX uses a multi-signature escrow system to ensure that your funds are safe. When you create an offer, you send your crypto to a multi-signature wallet. The funds are held in the wallet until both parties have confirmed that the trade has been completed.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">What are the fees for using PeerShieldEX?</h3>
              <p className="text-gray-400">PeerShieldEX charges a small fee for each trade. The fee is used to cover the costs of running the platform.</p>
            </div>
          </div>
        </div>
      </section>

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
