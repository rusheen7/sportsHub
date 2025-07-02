import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sportsHub",
  description: "Sports information for all of my favorite teams!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700">sportsHub</Link>
            <Link href="/mclaren" className="text-gray-700 hover:text-orange-600 font-medium">McLaren F1</Link>
            <Link href="/real-madrid" className="text-gray-700 hover:text-orange-600 font-medium">Real Madrid</Link>
            <Link href="/admin" className="text-gray-700 hover:text-orange-600 font-medium">Admin</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
