import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Circle } from 'lucide-react';

const EscrowProcess = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <div className="container-fluid py-5">
        <div className="text-center container px-4 sm:px-0 mt-24">
          <h1 className="text-green-500 text-4xl font-monst-text mt-5">
            Escrow Process
          </h1>
          <p className="text-gray-300 mt-2">
            While our escrow process seamlessly integrates automation, behind the scenes, we meticulously
            handle fund releases and
            dispute resolution for heightened security.
          </p>
        </div>
      </div>
      <div className="container-fluid bg-dark-bg5">
        <div className="container mx-auto py-5">
          <h4 className="font-bold mb-4 text-2xl">Process Overview</h4>
          <div className="flex items-start mb-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Buyer or seller start an escrow transaction
            </p>
          </div>
          <div className="flex items-start mb-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Buyer and seller confirm their email and asset addresses
            </p>
          </div>
          <div className="flex items-start mb-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Buyer pays; the buyer’s deposit to the exchange room address is validated and confirmed.
            </p>
          </div>
          <div className="flex items-start mb-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Seller sends item(s) to buyer
            </p>
          </div>
          <div className="flex items-start mb-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              In the case of crypto exchange; we validate and confirm the seller’s asset deposit to
              exchange room address.
            </p>
          </div>
          <div className="flex items-start mb-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Inspection period begins when buyer receives item(s). in the case of goods
            </p>
          </div>
          <div className="flex items-start mb-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Once the exchange is complete, Instantly Withdraw your exchanged asset to preferred or
              provided crypto address.
            </p>
          </div>
        </div>

        <div className="container mx-auto pb-12">
          <h4 className="font-bold mb-4 text-2xl">Escrow Dispute Guide</h4>
          <p className="text-sm text-gray-300">
            We encourage buyers and sellers to resolve disputes between themselves. However this is not
            always possible, so we offer
            an impartial systematic approach to solving most common disputes.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Important factors that determine our dispute decisions:
          </p>

          <div className="flex items-start mt-4">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Evidence of goods being received e.g. (tracking number, online receipt .. etc)
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Willingness of buyer and seller to cooperate with our requests for information
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Verification of buyer and seller's details
            </p>
          </div>

          <p className="text-sm text-gray-300 mt-4">
            We treat all dispute resolutions with client privacy high on our priority list. We will not ask
            our clients to reveal
            personal information unless the situation absolutely warrants this, or if we suspect fraud.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Where we do not receive enough evidence, do not receive responses from both parties, or cannot
            resolve a dispute our
            system withdraws all deposited assets to users provided accounts or addresses.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Our Service Guarantee also does not cover dispute resolution. In the case of dispute resolution
            you agree that you
            follow guides and regard your trade contract and our decision.
          </p>

          <div className="mt-4">
            <h5 className="font-bold text-lg">Fees</h5>
            <p className="text-sm text-gray-300">
              Dispute resolution fees are covered by the escrow fee and are deducted from the final
              payout.
            </p>
          </div>
          <div className="mt-2">
            <h5 className="font-bold text-lg">Cancellation</h5>
            <p className="text-sm text-gray-300">
              In the event of an escrow being cancelled the full escrow fee is imposed. This includes both
              buyer's and seller's cut of
              fees.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EscrowProcess;
