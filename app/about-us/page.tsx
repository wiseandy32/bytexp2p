import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaBullseye, FaEye, FaHeadset } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="bg-dark-bg5 text-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 pb-20 sm:px-0">
        <div className="p-4 pt-30 mx-auto bg-dark-bg w-full">
          <h5
            className="text-gray-300 text-sm font-bold aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="400"
          >
            ABOUT US
          </h5>
          <h2
            className="text-green-500 text-4xl font-monst-text aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            Our company
          </h2>

          <p className="mt-4 text-white text-sm">
            Bytexp2p is a trusted cryptocurrency escrow service featured on
            forbes. We aim at making crypto currency exchange as easy and fast
            as possible with our escrow system to reduce the rate of fraud and
            increase online transaction. Our escrow process is almost entirely
            automated. We encourage buyers and sellers to resolve disputes
            between themselves. However this is not always possible, so we offer
            an impartial systematic approach to solving most common disputes.
          </p>
          <div className="my-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <FaBullseye className="h-10 w-8 mx-auto" />
              <h5 className="my-4 text-white font-bold">Our mission</h5>
              <p className="text-white text-sm">
                In a world where cryptocurrencies are shifting the balance of
                power in the financial world, we at Bytexp2p are obligated to
                making exchanges faster, sustainable and reliable with a 100%
                moneyback guarantee.
              </p>
            </div>
            <div>
              <FaEye className="h-10 w-8 mx-auto" />
              <h5 className="my-4 text-white font-bold">Our vision</h5>
              <p className="text-white text-sm">
                Our vision is to add trust and reliability to online bitcoin
                transactions at minimal costs. We aim to provide a bitcoin
                escrow service that protects both buyers and sellers, via an
                independent, impartial dispute resolution service.
              </p>
            </div>
            <div>
              <FaHeadset className="h-10 w-8 mx-auto" />
              <h5 className="my-4 text-white font-bold">Best support</h5>
              <p className="text-white text-sm">
                We are committed to providing you with the highest levels of
                customer service. This includes protecting your privacy
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-white font-bold text-2xl">Why choose us</h4>
            <div className="mt-4">
              <h5 className="text-white font-bold">Competent Professionals</h5>
              <p className="text-white text-sm">
                We work in an atmosphere of trust and camaraderie, where
                partners help each other.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mt-4">
              <h5 className="text-white font-bold">Superior Service</h5>
              <p className="text-white">
                We are committed to providing clients with the best value and
                service in the industry.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mt-4">
              <h5 className="text-white font-bold">Safety</h5>
              <p className="text-white text-sm">
                Our system’s authentication, cold storage, smart backup, and
                manual withdrawals all ensure your funds remain safe and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
