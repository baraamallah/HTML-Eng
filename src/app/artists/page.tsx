
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_CREATORS } from '@/lib/constants'; // Changed from MOCK_ARTISTS
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { UserCircle2 } from 'lucide-react'; // Changed from User

export default function CreatorsPage() { // Renamed from ArtistsPage
  return (
    <div className="space-y-8">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary mb-2">Meet Our Creators</h1> {/* Changed title */}
        <p className="text-lg text-foreground/80">Discover the talented developers and designers sharing their work.</p> {/* Changed description */}
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_CREATORS.map((creator, index) => ( // Changed artist to creator
          <Card 
            key={creator.id} 
            className="group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col animate-fade-in-up"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <CardHeader className="items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-accent mb-4 group-hover:scale-105 transition-transform">
                <Image
                  src={creator.photoUrl}
                  alt={creator.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  data-ai-hint={creator.dataAiHint || "creator photo"} // Updated data-ai-hint
                />
              </div>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">{creator.name}</CardTitle>
              <CardDescription>{creator.location || 'Location not specified'}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80 text-center flex-grow">
              <p className="line-clamp-3">{creator.bio}</p> {/* Changed aboutMe to bio */}
            </CardContent>
            <CardFooter className="justify-center p-4">
              <Button asChild>
                <Link href={`/artists/${creator.id}`}> {/* Route kept as /artists for now, can be changed later */}
                  <UserCircle2 className="mr-2 h-4 w-4" /> View Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
