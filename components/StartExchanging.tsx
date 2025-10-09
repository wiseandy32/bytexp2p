import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const StartExchanging = () => {
  return (
    <div className="py-5 relative">
      <div className="container mx-auto py-4 px-4 sm:px-0">
        <div
          className="text-center p-8 lg:p-12 rounded-3xl aos-init aos-animate"
          style={{ background: 'linear-gradient(to right, rgb(40, 40, 47), rgb(22, 38, 58), rgb(13, 39, 72))' }}
          data-aos="zoom-in"
          data-aos-duration="700"
        >
          <h4 className="text-4xl font-bold">Start Exchanging Now</h4>
          <p className="m-0 mt-4 text-gray-400">
            Create a complimentary account to enjoy a secure crypto exchange experience with our escrow services
          </p>
    
          <div className="flex mt-10 justify-center flex-col md:flex-row">
            <Link href="https://peershieldex.com/register">
              <button className="w-full md:w-auto px-8 py-3 font-semibold flex justify-center items-center bg-green-500 rounded-md">
                Exchange Now <ArrowRight className="ml-2" style={{ fontSize: '16px' }} />
              </button>
            </Link>
            <Link href="">
              <button className="w-full md:w-auto px-8 py-3 font-semibold text-black bg-white mt-4 md:mt-0 md:ml-4 flex justify-center items-center rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"></path>
                </svg>
                <span className="ml-2">Download Mobile App</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExchanging;
