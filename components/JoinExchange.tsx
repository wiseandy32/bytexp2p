import Link from "next/link";

const featuredLogos = [
  {
    src: "/forbes.png",
    alt: "Forbes",
  },
  {
    src: "/fortune.png",
    alt: "Fortune",
  },
  {
    src: "/blocknomi.png",
    alt: "Blocknomi",
  },
  {
    src: "/coindesk-1.png",
    alt: "Coindesk",
  },
];

const JoinExchange = () => {
  return (
    <div className="bg-dark-bg5 font-sans-pro py-5">
      <div className="container mx-auto px-4 sm:px-0">
        <div className="text-center">
          <h1
            className="text-5xl font-bold aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            Join for instant crypto exchange
          </h1>
          <p
            className="text-gray-400 mt-4 aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="700"
          >
            Sign up for a free account to get a secure escrow crypto exchange
            experience.
          </p>
          <div
            className="mt-4 aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="700"
          >
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-new-blue rounded-md w-fit mr-3"
            >
              Create free account
            </Link>
            <Link
              className="px-4 py-2 bg-gray-700 rounded-md w-fit"
              href="/auth/login"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div
          className="mt-5 aos-init aos-animate"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <div className="relative flex items-center justify-center my-5">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-white text-xl">
              We are featured In
            </span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="block md:hidden">
            <div className="flex overflow-x-auto space-x-4 p-4">
              {featuredLogos.map((logo, index) => (
                <div key={index} className="flex-shrink-0 w-1/2">
                  <div className="p-2 bg-company-bg text-center rounded-lg">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-4 w-auto mx-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-4 gap-8 mt-5">
            {featuredLogos.map((logo, index) => (
              <div
                key={index}
                className="p-2 bg-company-bg text-center rounded-lg"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-4 w-auto mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinExchange;
