
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const heroEntry = useIntersectionObserver(heroRef, { threshold: 0.1, freezeOnceVisible: false });
  const isHeroObservedVisible = !!heroEntry?.isIntersecting;
  const showHeroAnimation = isMounted && isHeroObservedVisible;

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
            "mx-auto h-8 w-48 text-primary/40", // Made wider
            showHeroAnimation ? 'animate-fade-in-up' : 'opacity-0'
        )}
        style={showHeroAnimation ? { animationDelay: '0.2s' } : { opacity: 0 }}
      />

      {/* Featured Creator & Project Section Removed */}
      
      <section 
        className={cn(
          "py-12 animate-fade-in-up",
           isMounted ? 'opacity-100' : 'opacity-0' // Apply animation based on mount for this static section
        )}
        style={{ animationDelay: '0.4s' }}
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
