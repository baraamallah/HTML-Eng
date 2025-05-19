
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Ensured Card components are imported
import { MOCK_CREATORS, MOCK_PROJECTS } from '@/lib/constants'; // Import MOCK data

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const heroEntry = useIntersectionObserver(heroRef, { threshold: 0.1, freezeOnceVisible: false });
  const isHeroObservedVisible = !!heroEntry?.isIntersecting;
  const showHeroAnimation = isMounted && isHeroObservedVisible;

  // Logic for featured content or fallback
  const featuredCreator = MOCK_CREATORS.length > 0 ? MOCK_CREATORS[0] : null;
  const featuredProject = MOCK_PROJECTS.length > 0 ? MOCK_PROJECTS[0] : null;

  const featuredSectionRef = useRef<HTMLElement>(null); // Ref for the placeholder/featured section
  const featuredSectionEntry = useIntersectionObserver(featuredSectionRef, { threshold: 0.1, freezeOnceVisible: false });
  const isFeaturedSectionObservedVisible = !!featuredSectionEntry?.isIntersecting;
  const showFeaturedSectionAnimation = isMounted && isFeaturedSectionObservedVisible;

  return (
    <div className="space-y-12">
      <section
        ref={heroRef}
        className={cn(
          "text-center py-16 md:py-24 bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl shadow-xl",
          showHeroAnimation ? 'animate-fade-in-up' : 'opacity-0'
        )}
        style={showHeroAnimation ? { animationDelay: '0s' } : { opacity: 0 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">Welcome to DevPortfolio Hub</h1>
        <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-3xl mx-auto px-4">
          Showcase your code, share your designs, and connect with a vibrant community of creators. Innovation starts here.
        </p>
        <Button size="lg" asChild className="pulse-gentle text-lg py-3 px-8">
          <Link href="/gallery">Explore Showcase <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </section>

      <BrushStrokeDivider
        className={cn(
            "mx-auto h-8 w-48 text-primary/40",
            showHeroAnimation ? 'animate-fade-in-up' : 'opacity-0'
        )}
        style={showHeroAnimation ? { animationDelay: '0.2s' } : { opacity: 0 }}
      />
      
      {/* Fallback for Featured Content - Shown if MOCK_CREATORS and MOCK_PROJECTS are empty */}
      {!featuredCreator && !featuredProject && isMounted && (
        <section
          ref={featuredSectionRef} 
          id="featured-placeholder"
          className={cn(
            "animate-fade-in-up",
            showFeaturedSectionAnimation ? '' : 'opacity-0'
          )}
          style={showFeaturedSectionAnimation ? { animationDelay: '0.3s' } : { opacity: 0 }}
        >
          <h2 className="text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-accent"/> Explore Our Community
          </h2>
          <Card className="text-center p-8 bg-muted/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">No Featured Content Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground/80 mb-6">
                Amazing projects and creators will be highlighted here soon. In the meantime, explore the gallery!
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button size="lg" asChild>
                <Link href="/gallery">Visit the Showcase</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}
      
      <section 
        className={cn(
          "py-12 animate-fade-in-up",
           isMounted ? 'opacity-100' : 'opacity-0'
        )}
        style={{ animationDelay: isMounted && (!featuredCreator && !featuredProject) ? '0.5s' : '0.4s' }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold text-primary mb-4">Your Platform to Shine</h2>
          <p className="text-lg text-foreground/70 mb-8">
            DevPortfolio Hub is designed to empower developers and designers by providing a dedicated space to exhibit their finest work,
            discover inspiring projects, and engage with a supportive community. Whether you're a seasoned professional or just starting your journey,
            this is where your creations get the spotlight they deserve.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/upload">Share Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
