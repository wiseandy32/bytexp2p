import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

const Register = () => {
  return (
    <div className="bg-cover bg-center text-white min-h-screen" style={{ backgroundImage: "url('/bg-desktop.png')" }}>
      <Header />
      <div className="container mx-auto py-10 px-4 sm:px-0">
        <div className="max-w-md mx-auto mt-24 bg-dark-bg5 p-8 rounded-lg">
          <div className="text-center mb-8">
            <Link href="/">
                <Image src="/logo.png" alt="Peershieldex" width={130} height={32} />
            </Link>
          </div>
          <h4 className="text-2xl font-serif mb-2">Create Account</h4>
          <p className="text-gray-400 text-sm mb-6">Start exchanging crypto assets today. Secure & fast crypto escrow protocol.</p>
          
          <form>
            <div className="mb-4 relative">
              <input type="text" name="name" id="name" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" placeholder=" " required />
              <label htmlFor="name" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Full Name</label>
            </div>

            <div className="mb-4 relative">
              <input type="email" name="email" id="id_email" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" placeholder=" " required />
              <label htmlFor="id_email" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Email address</label>
            </div>

            <div className="mb-4 relative">
              <input type="password" name="password" id="id_password" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" placeholder=" " required />
              <label htmlFor="id_password" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Password</label>
            </div>

            <div className="mb-4 relative">
              <input type="password" name="password_confirmation" id="confirm_password" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" placeholder=" " required />
              <label htmlFor="confirm_password" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Confirm Password</label>
            </div>

            <div className="flex items-center mb-6">
              <input type="checkbox" id="agree" required className="mr-2" />
              <label htmlFor="agree" className="text-sm text-gray-400">I've read and agree with <Link href="/terms" className="text-green-500">Peershieldex terms of service</Link></label>
            </div>

            <button type="submit" className="w-full bg-new-blue hover:bg-new-blue-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Create account</button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">Already have an account?</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <p className="text-center">
              <Link href="/login" className="text-green-500">Log In</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;