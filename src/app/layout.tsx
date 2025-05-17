
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
        
        {/* Fixed School Logo in Bottom Right Corner */}
        <div className="fixed bottom-4 right-4 z-50">
          <Link href="/" passHref aria-label="School Logo - Home">
            <div className="cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="https://placehold.co/120x50.png?text=School+Logo" // Replace with your actual logo
                alt="School Logo"
                width={120} 
                height={50}
                className="object-contain rounded shadow-md"
                data-ai-hint="school logo"
              />
            </div>
          </Link>
        </div>
      </body>
    </html>
  );
}
