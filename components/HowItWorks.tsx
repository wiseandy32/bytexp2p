import { Webhook, Users, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="bg-dark-bg3 py-20 sans-pro">
      <div className="container mx-auto px-4">
        <div className="text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="600">
          <p className="text-sm text-green-500 m-0">Start and complete Escrow in 3-easy steps.</p>
          <h1 className="text-white text-4xl font-bold">Securely Exchange crypto assets in minutes</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-16 mt-16 items-center">
          <div className="aos-init aos-animate" data-aos="fade-right" data-aos-duration="600">
            <img src="https://peershieldex.com/assets/images/arrows.png" alt="vector" className="w-full h-auto" />
          </div>
          <div className="mt-5 aos-init aos-animate" data-aos="fade-up" data-aos-duration="800">
            <div className="relative">
              <div className="flex items-start mb-8">
                <div className="bg-gray-700 rounded-full p-2 mr-4">
                  <Webhook className="text-white" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Create Exchange room</h3>
                  <p className="text-sm text-gray-400 bg-dark-bg4 p-3 rounded-md">
                    Proceed to create the exchange room. Share your exchange ID with a trade partner to join them to the trade.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-8">
                <div className="bg-gray-700 rounded-full p-2 mr-4">
                  <Users className="text-white" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Exchange Assets</h3>
                  <p className="text-sm text-gray-400 bg-dark-bg4 p-3 rounded-md">
                    Complete the exchange with just a click. Join existing trades or created exchange room are all seamlessly optimized.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 rounded-full p-2 mr-4">
                  <CheckCircle className="text-white" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Withdraw</h3>
                  <p className="text-sm text-gray-400 bg-dark-bg4 p-3 rounded-md">
                    Once the exchange is complete, Instantly Withdraw your exchanged asset to your preferred crypto address.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-right">
              <a href="https://peershieldex.com/login">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
                  Start Exchange
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
