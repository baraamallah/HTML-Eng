import Image from 'next/image';
import Link from 'next/link';
import type { Artwork } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/gallery?artwork=${artwork.id}`}> {/* This could link to a modal or detailed page later */}
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              width={300}
              height={200} // Adjust height for better aspect ratio on a 300px wide card
              className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
              style={{ minWidth: '300px' }}
              data-ai-hint={artwork.dataAiHint || "artwork"}
            />
        </Link>
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-card/70 hover:bg-card text-destructive hover:text-destructive scale-90 group-hover:scale-100 transition-transform"
            aria-label="Favorite"
          >
            <Heart className="h-5 w-5" />
          </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
          <Link href={`/gallery?artwork=${artwork.id}`}>{artwork.title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          By <Link href={`/artists/${artwork.artistId}`} className="hover:underline hover:text-accent">{artwork.artistName}</Link>
        </p>
        <p className="text-xs text-muted-foreground mt-1">Category: {artwork.category}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/gallery?artwork=${artwork.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
