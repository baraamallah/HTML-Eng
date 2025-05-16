import Image from 'next/image';
import Link from 'next/link';
import { getArtistById, getArtworksByArtist, MOCK_ARTISTS } from '@/lib/constants';
import { ArtworkCard } from '@/components/artwork-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Mail, MapPin, Info, Palette as PaletteIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

interface ArtistProfilePageProps {
  params: { artistId: string };
}

export function generateStaticParams() {
  return MOCK_ARTISTS.map(artist => ({
    artistId: artist.id,
  }));
}

export default function ArtistProfilePage({ params }: ArtistProfilePageProps) {
  const artist = getArtistById(params.artistId);
  if (!artist) {
    notFound();
  }
  const artworks = getArtworksByArtist(params.artistId);

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 bg-accent/10 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-lg mb-4">
              <Image
                src={artist.photoUrl}
                alt={artist.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={artist.dataAiHint || "artist photo"}
              />
            </div>
            <h1 className="text-3xl font-bold text-primary text-center">{artist.name}</h1>
            {artist.location && (
              <p className="text-muted-foreground text-center mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {artist.location}
              </p>
            )}
             <Button variant="outline" className="mt-6 pulse-gentle">
              <Mail className="mr-2 h-4 w-4" /> Contact Artist
            </Button>
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-accent"><Info className="w-6 h-6" /> About Me</h2>
              <p className="text-foreground/90 leading-relaxed">{artist.aboutMe}</p>
            </section>
            <BrushStrokeDivider className="my-6 h-4 w-24 text-primary/30" />
            {artist.statement && (
              <section>
                <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-accent"><PaletteIcon className="w-6 h-6" /> Artist Statement</h2>
                <blockquote className="italic text-foreground/80 border-l-4 border-accent pl-4 py-2 leading-relaxed">
                  {artist.statement}
                </blockquote>
              </section>
            )}
          </div>
        </div>
      </Card>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Artwork Portfolio</h2>
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">This artist hasn't uploaded any artwork yet.</p>
        )}
      </section>
    </div>
  );
}
