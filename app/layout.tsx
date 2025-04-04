import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Our Romantic Space",
  description: "A cute and minimalistic romantic-themed website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#fff5f7] to-[#ffebf1] min-h-screen relative`}
      >
        {/* Decorative floating hearts in the background */}
        <div className="fixed top-20 left-[10%] text-pink-200 text-4xl opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>❤</div>
        <div className="fixed top-[40%] right-[5%] text-pink-200 text-3xl opacity-20 animate-pulse" style={{ animationDuration: '6s' }}>❤</div>
        <div className="fixed bottom-[20%] left-[8%] text-pink-200 text-2xl opacity-20 animate-pulse" style={{ animationDuration: '5s' }}>❤</div>
        <div className="fixed bottom-[15%] right-[15%] text-pink-200 text-4xl opacity-20 animate-pulse" style={{ animationDuration: '7s' }}>❤</div>
        <div className="fixed top-[15%] right-[20%] text-pink-200 text-2xl opacity-20 animate-pulse" style={{ animationDuration: '5.5s' }}>❤</div>
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
