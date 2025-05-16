
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Users, Target, Palette, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">About Artful Aging</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover the story and passion behind our community dedicated to senior artists.
        </p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <Card className="shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
             <Image
                src="https://placehold.co/600x400.png"
                alt="Group of seniors painting together"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="seniors art class"
              />
          </div>
          <div className="md:w-1/2 p-6 md:p-8">
            <CardHeader>
              <CardTitle className="text-3xl text-primary flex items-center">
                <Target className="w-8 h-8 mr-3 text-accent" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/90">
              <p>
                At Artful Aging, we believe that creativity knows no age. Our mission is to provide a vibrant and supportive digital space where senior artists can share their work, connect with peers, and continue to explore their passion for the arts.
              </p>
              <p>
                We aim to combat isolation and foster a sense of community by celebrating the unique talents and stories of older adults. Art is a powerful tool for expression, joy, and lifelong learning, and we're here to champion that every step of the way.
              </p>
            </CardContent>
          </div>
        </div>
      </Card>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center text-primary mb-6 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-accent" /> What We Offer
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="text-accent"/> Showcase Your Talent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">A beautiful gallery to display your artwork and dedicated artist profiles to share your journey.</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="text-accent"/> Connect & Inspire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">Join a welcoming community of fellow senior artists, share feedback, and find inspiration.</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="text-accent"/> Engage & Grow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">Participate in fun art challenges, discover new techniques, and keep your creative spirit alive.</p>
            </CardContent>
          </Card>
           <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">Our platform is designed to be user-friendly and accessible for everyone.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="text-center p-8 bg-gradient-to-br from-primary/10 to-accent/10 shadow-xl">
        <CardTitle className="text-3xl text-primary mb-4">Join Our Creative Family</CardTitle>
        <CardDescription className="text-lg text-foreground/80 mb-6">
          Whether you're a lifelong artist or have just discovered your passion, Artful Aging is your space to shine.
        </CardDescription>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/gallery">Explore the Gallery</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/upload">Share Your Art</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
