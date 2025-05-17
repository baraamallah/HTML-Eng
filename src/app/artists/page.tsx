
import Link from 'next/link'; // Ensured import
import Image from 'next/image';
import { MOCK_CREATORS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { UserCircle2, Mail, UserPlus } from 'lucide-react';

export default function CreatorsPage() {
  return (
    <div className="space-y-8">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary mb-2">Meet Our Creators</h1>
        <p className="text-lg text-foreground/80">Discover the talented developers and designers sharing their work.</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      {MOCK_CREATORS.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8">
          {MOCK_CREATORS.map((creator, index) => (
            <Card 
              key={creator.id} 
              className="group w-full max-w-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col animate-fade-in-up"
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
                    data-ai-hint={creator.dataAiHint || "creator photo"}
                  />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">{creator.name}</CardTitle>
                <CardDescription>{creator.location || 'Location not specified'}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-foreground/80 text-center flex-grow">
                <p className="line-clamp-3">{creator.bio}</p>
              </CardContent>
              <CardFooter className="justify-center p-4">
                <Button asChild>
                  <Link href={`/artists/${creator.id}`}>
                    <UserCircle2 className="mr-2 h-4 w-4" /> View Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Card className="shadow-lg animate-fade-in-up bg-gradient-to-br from-primary/10 to-accent/10" style={{ animationDelay: `${0.2 + MOCK_CREATORS.length * 0.1}s` }}>
        <CardHeader className="items-center text-center">
          <UserPlus className="w-12 h-12 text-primary mb-3" />
          <CardTitle className="text-2xl text-primary">Want to Showcase Your Profile?</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-foreground/90">
            We'd love to feature your work! Connect with the founder, Baraa Elmalah, to get your profile added to DevPortfolio Hub.
          </p>
          <p className="mt-3 font-semibold text-accent">
            <Mail className="inline-block mr-2 h-5 w-5 align-text-bottom" />
            <a href="mailto:baraa.elmalah@gmail.com" className="hover:underline">
              baraa.elmalah@gmail.com
            </a>
          </p>
        </CardContent>
        <CardFooter className="justify-center p-4">
          <Button asChild className="pulse-gentle">
            <a href="mailto:baraa.elmalah@gmail.com">
              <Mail className="mr-2 h-4 w-4" /> Contact Baraa
            </a>
          </Button>
        </CardFooter>
      </Card>

      {MOCK_CREATORS.length === 0 && (
         <p className="text-center text-lg text-muted-foreground py-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
           No creators featured yet. Be the first!
         </p>
      )}
    </div>
  );
}
