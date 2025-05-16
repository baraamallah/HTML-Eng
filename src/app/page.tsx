
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_CREATORS, MOCK_PROJECTS, MOCK_CHALLENGES } from '@/lib/constants';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { ProjectCard } from '@/components/project-card';
import { Award, Target, BrainCircuit } from 'lucide-react';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const featuredCreator = MOCK_CREATORS.find(creator => creator.id === MOCK_PROJECTS.find(proj => proj.isFeatured)?.creatorId) || MOCK_CREATORS[0];
  const featuredProject = MOCK_PROJECTS.find(proj => proj.isFeatured) || MOCK_PROJECTS[0];

  const heroRef = useRef<HTMLElement>(null);
  const heroEntry = useIntersectionObserver(heroRef, { threshold: 0.1, freezeOnceVisible: false });
  const isHeroVisible = !!heroEntry?.isIntersecting;

  const featuredCreatorRef = useRef<HTMLElement>(null);
  const featuredCreatorEntry = useIntersectionObserver(featuredCreatorRef, { threshold: 0.1, freezeOnceVisible: false });
  const isFeaturedCreatorVisible = !!featuredCreatorEntry?.isIntersecting;
  
  const challengesRef = useRef<HTMLElement>(null);
  const challengesEntry = useIntersectionObserver(challengesRef, { threshold: 0.1, freezeOnceVisible: false });
  const isChallengesVisible = !!challengesEntry?.isIntersecting;

  // For BrushStrokeDividers, we can also animate them if needed, or leave as is
  // For simplicity, I'm focusing on the main sections first.
  // To animate BrushStrokeDividers, they'd need their own refs and observer logic,
  // or be wrapped in an animatable component.

  return (
    <div className="space-y-12">
      <section
        ref={heroRef}
        className={cn(
          "text-center py-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg shadow-lg",
          isHeroVisible ? 'animate-fade-in-up' : 'opacity-0'
        )}
        style={isHeroVisible ? { animationDelay: '0s' } : { opacity: 0 }}
      >
        <h1 className="text-5xl font-bold mb-4 text-primary">Welcome to DevPortfolio Hub</h1>
        <p className="text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
          Showcase your code, share your designs, and connect with a vibrant community of creators. Innovation starts here.
        </p>
        <Button size="lg" asChild className="pulse-gentle">
          <Link href="/gallery">Explore Showcase</Link>
        </Button>
      </section>

      <BrushStrokeDivider 
        className={cn(
            "mx-auto h-8 w-40 text-primary/50",
            // Example if we want to animate it too, would need its own observer
            // isSomeOtherTriggerVisible ? 'animate-fade-in-up' : 'opacity-0'
            "animate-fade-in-up" // Keeping existing one-time animation for now
        )}
        style={{ animationDelay: '0.1s' }} 
      />

      {featuredCreator && featuredProject && (
        <section
          ref={featuredCreatorRef}
          id="featured-creator"
          className={cn(
            isFeaturedCreatorVisible ? 'animate-fade-in-up' : 'opacity-0'
          )}
          style={isFeaturedCreatorVisible ? { animationDelay: '0.2s' } : { opacity: 0 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><Award className="w-8 h-8 text-accent" /> Featured Creator of the Week</h2>
          <Card className="overflow-hidden shadow-xl transform hover:scale-101 transition-transform duration-300">
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <Image
                  src={featuredCreator.photoUrl}
                  alt={featuredCreator.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                  data-ai-hint={featuredCreator.dataAiHint || "developer portrait"}
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">{featuredCreator.name}</CardTitle>
                  <CardDescription>{featuredCreator.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-foreground/90 line-clamp-3">{featuredCreator.bio}</p>
                  <h4 className="font-semibold text-accent mb-2">Featured Project: "{featuredProject.title}"</h4>
                  <Link href={`/gallery?project=${featuredProject.id}`}>
                    <Image 
                      src={featuredProject.previewImageUrl} 
                      alt={featuredProject.title} 
                      width={200} 
                      height={150} 
                      className="rounded-md shadow-md hover:opacity-80 transition-opacity"
                      data-ai-hint={featuredProject.dataAiHint || "project preview"}
                    />
                  </Link>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href={`/artists/${featuredCreator.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </section>
      )}
      
      <BrushStrokeDivider 
        className="mx-auto h-8 w-40 text-primary/50 animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      />

      <section
        ref={challengesRef}
        id="coding-challenges"
        className={cn(
          isChallengesVisible ? 'animate-fade-in-up' : 'opacity-0'
        )}
        style={isChallengesVisible ? { animationDelay: '0.4s' } : { opacity: 0 }}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><BrainCircuit className="w-8 h-8 text-accent"/> Coding & Design Challenges</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {MOCK_CHALLENGES.map((challenge, index) => {
            // Individual challenge cards could also use the ProjectCard animation pattern
            // For now, the parent section animates.
            return (
            <Card 
              key={challenge.id} 
              className={cn(
                "shadow-lg hover:shadow-xl transition-shadow duration-300",
                // If we want individual card animation based on scroll:
                // isChallengesVisible ? 'animate-fade-in-up' : 'opacity-0'
                // This would require each card to be observed or a more complex setup.
                // For now, inherit animation from parent section or use a simpler one-time animation.
                 "animate-fade-in-up" // Existing one-time animation for items within the already animated section
              )}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }} // Stagger based on parent visibility
            >
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 line-clamp-3">{challenge.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Ends: {new Date(challenge.endDate).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter>
                <Button>View Challenge</Button>
              </CardFooter>
            </Card>
          )})}
        </div>
      </section>
    </div>
  );
}
