"use client";

import Link from "next/link";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-cover bg-center text-white min-h-screen" style={{ backgroundImage: "url('/bg-desktop.png')" }}>
      <div className="container mx-auto py-10 px-4 sm:px-0">
        <div className="max-w-md mx-auto mt-24 bg-dark-bg5 p-8 rounded-lg">
            <div className="text-center mb-8">
                <Link href="/">
                    <Image src="/logo.png" alt="Peershieldex" width={130} height={32} />
                </Link>
            </div>
            {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
