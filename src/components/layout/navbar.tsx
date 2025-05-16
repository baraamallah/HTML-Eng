
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2 } from 'lucide-react'; // Changed from Paintbrush

export default function Navbar() {
  return (
    <nav className="bg-card text-card-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">DevPortfolio Hub</h1>
        </Link>
        <div className="space-x-1 md:space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/gallery">Showcase</Link> {/* Changed from Gallery */}
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/artists">Creators</Link> {/* Changed from Artists */}
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="default" asChild className="pulse-gentle">
            <Link href="/upload">Share Project</Link> {/* Changed from Upload Art */}
          </Button>
        </div>
      </div>
    </nav>
  );
}
