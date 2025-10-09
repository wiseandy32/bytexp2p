import { MdRadioButtonChecked } from "react-icons/md";

const timelineItems = [
  {
    text: "Military grade security & High speed protocols.",
  },
  {
    text: "Your protection matters to us. That’s why we only use the best ways to protect your assets during and after trades. Cryptocurrencies are saved as stable coins with blockchain level security.",
  },
  {
    text: "Our system detects fake assets, ensuring they cannot be used in trades. Guaranteeing secure transactions with confidence.",
  },
];

const TrustedGlobally = () => {
  return (
    <div className="bg-dark-bg3 py-5 font-sans-pro">
      <div className="container mx-auto px-4 sm:px-0">
        <div className="mb-5">
          <h5 className="text-gray-400 text-lg aos-init aos-animate" data-aos="fade-up" data-aos-duration="700">
            Accessible anytime & anywhere
          </h5>
          <h2 className="text-white text-4xl font-bold aos-init aos-animate" data-aos="fade-up" data-aos-duration="800">
            Trusted by users all over the globe
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aos-init aos-animate" data-aos="fade-up" data-aos-duration="400">
            {timelineItems.map((item, index) => (
              <div className="timeline-wrapper mt-3 flex items-start" key={index}>
                <div>
                  <MdRadioButtonChecked className="p-1 bg-dark-bg2 text-gray-400 rounded-full text-2xl" />
                </div>
                <div className="bg-dark-bg4 rounded-lg ml-4 p-3">
                    <p className="text-sm text-gray-400 m-0">
                      {item.text}
                    </p>
                </div>
              </div>
            ))}
          </div>
          <div className="aos-init aos-animate" data-aos="fade-up" data-aos-duration="400">
            <div className="text-center p-4 bg-dark-bg4 rounded-lg h-full">
              <h3 className="text-blue-500">Need Help?</h3>
              <div data-aos="fade-up" data-aos-duration="600" className="aos-init aos-animate">
                <img src="https://peershieldex.com/assets/images/clock.png" alt="24/7 support" className="w-24 h-24 mx-auto" />
              </div>
              <div className="mt-3">
                <h5 className="text-xl font-bold">24/7 Live support</h5>
                <p className="text-sm text-gray-400 aos-init aos-animate" data-aos="fade-up" data-aos-duration="700">
                  Our support assistance staffs are available 24 hours a day to help you for trading or answer any other question you might have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedGlobally;
