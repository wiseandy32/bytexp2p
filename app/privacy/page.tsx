import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <div className="container-fluid bg-dark-bg3 py-5">
        <div className="text-center container pb-5 pt-3 mt-24">
          <h1 className="text-green-500 text-4xl font-monst-text mt-5">
            Legal and privacy policy
          </h1>
        </div>
      </div>
      <div className="container mx-auto border-t border-gray-700 pt-12 bg-dark-bg5 px-4 sm:px-6 lg:px-8 pb-12">
        <div>
          <h5 className="font-bold text-lg mb-2">Protecting your privacy</h5>
          <p className="text-sm text-gray-400">
            We are committed to providing you with the highest levels of
            customer service. This includes protecting your privacy.
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Set out below is information that we are required to communicate to
            our customers. We recommend that you keep this information for
            future reference.
          </p>
        </div>

        <div className="mt-8">
          <h5 className="font-bold text-lg mb-2">
            Information we collect about you
          </h5>
          <p className="text-sm text-gray-400">
            Information held by us may include your email address, bitcoin
            address, ip address, the date(s) and time(s) you visit Bytexp2p. We
            also hold details of your bitcoin escrow transactions, and any
            affiliate accounts you hold with us.
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Set out below is information that we are required to communicate to
            our customers. We recommend that you keep this information for
            future reference.
          </p>
        </div>

        <div className="mt-8">
          <h5 className="font-bold text-lg mb-2">
            When we disclose your information
          </h5>
          <p className="text-sm text-gray-400">
            We will not normally disclose or publish information about you to a
            third party, except where required to do so by law, or where we find
            you have abused or attempted to gain unauthrorized access to our
            services.
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Requests from third parties for personal information must be
            accompanied by a verifiable court order. Information provided will
            be strictly limited to the scope of any such court order.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
