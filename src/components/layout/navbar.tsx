import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-card text-card-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Paintbrush className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Artful Aging</h1>
        </Link>
        <div className="space-x-2 md:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/gallery">Gallery</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/artists">Artists</Link>
          </Button>
          <Button variant="default" asChild className="pulse-gentle">
            <Link href="/upload">Upload Art</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
