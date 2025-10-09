import Link from 'next/link';
import { MapPin, Phone, Twitter, Send, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <div className="bg-dark-bg3 font-sans-pro">
      <div className="container mx-auto py-12">
        <div className="flex items-center mb-8">
          <img src="https://peershieldex.com/assets/images/favicon.png" alt="Peershieldex" className="w-6 h-6" />
          <h5 className="text-xl font-bold ml-2">Peershieldex</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-16 text-sm">
          <div>
            <h5 className="text-base font-bold mb-4">COMPANY</h5>
            <p className="mb-2">
              <Link href="https://peershieldex.com/terms" className="text-gray-400 text-sm">Terms and Conditions</Link>
            </p>
            <p className="mb-2">
              <Link href="https://peershieldex.com/privacy" className="text-gray-400 text-sm">Policy</Link>
            </p>
            <p>
              <Link href="https://peershieldex.com/about-us" className="text-gray-400 text-sm">About Us</Link>
            </p>
          </div>

          <div>
            <h5 className="text-base font-bold mb-4">RESOURCES</h5>
            <p className="mb-2">
              <a href="https://academy.binance.com/en" className="text-white" target="_blank" rel="noopener noreferrer">
                New to crypto
              </a>
            </p>
            <p className="mb-2">
              <Link href="https://peershieldex.com/escrow-service-guarantee" className="text-white">Escrow Guarantee</Link>
            </p>
            <p>
              <Link href="https://peershieldex.com/escrow-process" className="text-white">Escrow Process</Link>
            </p>
          </div>

          <div>
            <h5 className="text-base font-bold mb-4 text-white">Contact Us</h5>
            <div className="mb-4">
              <p className="flex items-start mb-2">
                <MapPin className="text-gray-400 mt-1 mr-2" size={18} />
                <span>
                  Address: <br />
                  <small>5 Brayford Square, Stepney Green, London E10SG</small>
                </span>
              </p>
              <p className="flex items-center">
                <Phone className="text-gray-400 mr-2" size={18} />
                <span>
                  WhatsApp: <br />
                  <small>+447438472430</small>
                </span>
              </p>
            </div>
          </div>

          <div>
            <h5 className="text-base font-bold mb-4 text-white">Follow Us</h5>
            <div className="flex space-x-4">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="https://t.me/peershield" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Send size={18} />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
