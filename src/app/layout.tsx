
import type { Metadata } from 'next';
import { playfairDisplay, lato } from '@/lib/fonts';
import './globals.css';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'DevPortfolio Hub',
  description: 'A showcase for developers and designers to share their projects and code.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${lato.variable} antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
        
        {/* Fixed School Logo in Bottom Right Corner - REMOVED */}
      </body>
    </html>
  );
}
