import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Circle } from 'lucide-react';

const EscrowServiceGuarantee = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <div className="container-fluid py-5">
        <div className="text-center container mx-auto px-4 sm:px-0 mt-24">
          <h1 className="text-green-500 text-4xl font-bold font-serif mt-5">
            Escrow Service Guarantee
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Whether you're a seasoned bitcoin expert, or a first-time bitcoin user, Peershieldex escrow
            delivers the level of service, expertise, and peace-of-mind you need. As part of our service
            guarantee we cover the first $500 USD, or the total value of bitcoins in escrow if less than
            $500 USD.
          </p>
        </div>
      </div>
      <div className="container-fluid bg-dark-bg5 font-sans">
        <div className="container mx-auto py-5">
          <h4 className="font-bold font-serif text-2xl mb-4">What We Cover</h4>
          <p className="text-sm text-gray-300">
            Our coverage is limited to the escrow cryptocurrencies while they are under our direct control.
            That is, after we receive escrow cryptocurrencies, until we settle the escrow. For example we
            cover against losses arising from:
          </p>
          <div className="flex items-start mt-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Theft from our server(s).
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Hacking our server(s).
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Unauthorized access server(s).
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Any loss of fund by our systems or staffs.
            </p>
          </div>
        </div>

        <div className="container mx-auto pb-12">
          <h4 className="font-serif text-2xl mb-4">What is Not Covered</h4>
          <p className="text-sm text-gray-300">
            We however do not cover user actions beyond our control. Including, but not limited to:
          </p>

          <div className="flex items-start mt-2">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Incorrect crypto address provided.
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Provision of incorrect email address.
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Early release of bitcoins initiated by user.
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Payment to bitcoin addresses in spoofed emails (Note: we do not send the payment address via
              email).
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Any other loss arising from user negligence.
            </p>
          </div>
          <div className="flex items-start">
            <Circle className="text-green-500 mr-3 mt-1" size={8} />
            <p className="text-sm text-gray-300">
              Our Service Guarantee also does not cover dispute resolution. In the case of dispute
              resolution you agree that our decision is final.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EscrowServiceGuarantee;
