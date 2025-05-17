
import { BrushStrokeDivider } from "@/components/icons/brush-stroke-divider";
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <BrushStrokeDivider className="mx-auto mb-4 h-6 w-32 text-muted-foreground" />
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DevPortfolio Hub. Empowering developers and designers.
        </p>
        <p className="text-xs mt-2 text-muted-foreground">
          Built for the creative tech community.
        </p>
        <p className="text-xs mt-2 text-muted-foreground">
          For support or issues, contact: <a href="mailto:baraa.elmalah@gmail.com" className="hover:underline text-primary">baraa.elmalah@gmail.com</a>
        </p>
        <div className="mt-6">
          <Link href="/" passHref aria-label="School Logo - Home">
            <div className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="https://placehold.co/120x50.png?text=School+Logo" // Replace with your actual logo
                alt="School Logo"
                width={120} 
                height={50}
                className="object-contain rounded"
                data-ai-hint="school logo"
              />
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}
