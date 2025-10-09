import { Coins, ChevronDown, Radio, Verified, Receipt } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="container mx-auto pt-48 pb-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="aos-init aos-animate" data-aos="fade-up" data-aos-duration="500">
          <div className="inline-flex items-center bg-gray-800 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-700 mb-4">
            <Coins className="mr-2" size={16} />
            Low Exchange Fees
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
            <span className="text-green-400">Swift & Secure</span>
            <br />
            P2P Escrow for Crypto & NFT
          </h1>
          <p className="text-gray-400 mb-8">
            Peershieldex supports 60+ assets, ensuring a professional and seamless trading experience. Your confidence, our priority.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <button className="bg-new-blue hover:bg-new-blue-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Exchange Now
              </button>
            </Link>
            <Link href="/about-us">
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex text-sm font-semibold mb-6">
              <div className="flex items-center text-white mr-4">
                <Radio className="text-green-500 mr-2" size={16} /> Buy
              </div>
              <div className="flex items-center text-gray-400">
                <Radio className="mr-2" size={16} /> Sell
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-bold mb-2 block">You Send</label>
              <div className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
                <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
                  <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@bea1a9722a8c63169dcc06e86182bf2c55a76bbc/svg/color/btc.svg" alt="BTC" className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">BTC</span>
                  <ChevronDown className="text-gray-400 ml-1" size={16} />
                </div>
                <span className="font-bold text-lg">0.34</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-gray-400 font-bold mb-2 block">You Receive</label>
              <div className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
                <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
                  <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@bea1a9722a8c63169dcc06e86182bf2c55a76bbc/svg/color/trx.svg" alt="TRX" className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm">TRX</span>
                  <ChevronDown className="text-gray-400 ml-1" size={16} />
                </div>
                <span className="font-bold text-lg">106773.23</span>
              </div>
            </div>

            <div className="mt-6 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Escrow fee</span>
                <span>0.017 <span className="font-bold text-gray-500">BTC</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Value</span>
                <span>0.317 <span className="font-bold text-gray-500">BTC</span></span>
              </div>
            </div>

            <button className="w-full mt-6 bg-new-blue text-white font-bold py-3 rounded-lg hover:bg-new-blue-dark transition-colors" disabled>
              Continue
            </button>
          </div>
          <div className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 w-96 h-96 bg-green-900 rounded-full filter blur-3xl opacity-20"></div>
        
          <div className="absolute z-20 top-1/2 -right-12 transform -translate-y-1/2 bg-gray-800 border-gray-700 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full">
                  <Receipt size={20} />
              </div>
              <div className="ml-3 text-xs">
                  <p className="font-bold text-white">Trade execution</p>
                  <p className="text-gray-400">Completed by Buyer & Seller</p>
              </div>
            </div>
            <div className="h-4 w-px bg-blue-400 ml-5 my-1"></div>
             <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full">
                  <Verified size={20} />
              </div>
              <div className="ml-3 text-xs">
                  <p className="font-bold text-white">Verifying Trade</p>
                  <p className="text-gray-400">validated by <span className='text-white font-bold'>Peershieldex</span></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
