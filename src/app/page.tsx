
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_ARTISTS, MOCK_ARTWORKS, MOCK_CHALLENGES } from '@/lib/constants';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { ArtworkCard } from '@/components/artwork-card';
import { Award, Target } from 'lucide-react';

export default function HomePage() {
  const featuredArtist = MOCK_ARTISTS.find(artist => artist.id === MOCK_ARTWORKS.find(art => art.isFeatured)?.artistId) || MOCK_ARTISTS[0];
  const featuredArtwork = MOCK_ARTWORKS.find(art => art.isFeatured) || MOCK_ARTWORKS[0];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg shadow-lg animate-fade-in-up">
        <h1 className="text-5xl font-bold mb-4 text-primary">Welcome to Artful Aging</h1>
        <p className="text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
          Celebrate your creativity, share your work, and connect with a like-minded community. Art has no age limit.
        </p>
        <Button size="lg" asChild className="pulse-gentle">
          <Link href="/gallery">Explore the Gallery</Link>
        </Button>
      </section>

      <BrushStrokeDivider className="mx-auto h-8 w-40 text-primary/50" />

      {featuredArtist && featuredArtwork && (
        <section id="featured-artist" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><Award className="w-8 h-8 text-accent" /> Featured Artist of the Week</h2>
          <Card className="overflow-hidden shadow-xl transform hover:scale-101 transition-transform duration-300">
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <Image
                  src={featuredArtist.photoUrl}
                  alt={featuredArtist.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                  data-ai-hint={featuredArtist.dataAiHint || "artist photo"}
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">{featuredArtist.name}</CardTitle>
                  <CardDescription>{featuredArtist.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-foreground/90">{featuredArtist.aboutMe}</p>
                  <h4 className="font-semibold text-accent mb-2">Featured Work: "{featuredArtwork.title}"</h4>
                  <Link href={`/gallery?artwork=${featuredArtwork.id}`}>
                    <Image 
                      src={featuredArtwork.imageUrl} 
                      alt={featuredArtwork.title} 
                      width={200} 
                      height={150} 
                      className="rounded-md shadow-md hover:opacity-80 transition-opacity"
                      data-ai-hint={featuredArtwork.dataAiHint || "artwork"}
                    />
                  </Link>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href={`/artists/${featuredArtist.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </section>
      )}
      
      <BrushStrokeDivider className="mx-auto h-8 w-40 text-primary/50" />

      <section id="art-challenges" className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><Target className="w-8 h-8 text-accent"/> Monthly Art Challenges</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {MOCK_CHALLENGES.map((challenge) => (
            <Card key={challenge.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90">{challenge.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Ends: {new Date(challenge.endDate).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter>
                <Button>View Challenge</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
