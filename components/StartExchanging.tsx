import Link from "next/link";
import { ArrowRight } from "lucide-react";

const StartExchanging = () => {
  return (
    <div className="py-5 relative">
      <div className="container mx-auto py-4 px-4 sm:px-0">
        <div
          className="text-center p-8 lg:p-12 rounded-3xl aos-init aos-animate"
          style={{
            background:
              "linear-gradient(to right, rgb(40, 40, 47), rgb(22, 38, 58), rgb(13, 39, 72))",
          }}
          data-aos="zoom-in"
          data-aos-duration="700"
        >
          <h4 className="text-4xl font-bold">Start Exchanging Now</h4>
          <p className="m-0 mt-4 text-gray-400">
            Create a complimentary account to enjoy a secure crypto exchange
            experience with our escrow services
          </p>

          <div className="flex mt-10 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-3 font-semibold flex justify-center items-center bg-new-blue rounded-md">
                Exchange Now{" "}
                <ArrowRight className="ml-2" style={{ fontSize: "16px" }} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExchanging;
