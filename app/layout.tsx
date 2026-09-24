import { AuthProvider } from "./context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import SmartsuppChat from "@/components/SmartsuppChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bytexp2p",
  description: "Best escrow service for peer to peer crypto trading",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <AuthProvider>
          {children}
          <Toaster />
          <SmartsuppChat />
        </AuthProvider>
      </body>
    </html>
  );
}
