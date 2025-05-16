
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Users, Target, Code2, Component, Sparkles, Terminal } from 'lucide-react'; // Updated icons

export default function AboutPage() {
  const aboutImageHint = "team office";
  return (
    <div className="space-y-12">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary mb-2">About DevPortfolio Hub</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover the vision behind our platform for developers and designers.
        </p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <Card className="shadow-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="md:flex">
          <div className="md:w-1/2">
             <Image
                src={`https://source.unsplash.com/600x400/?${aboutImageHint.replace(/ /g, ',')}`}
                alt="Diverse group of developers collaborating"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint={aboutImageHint}
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
                At DevPortfolio Hub, we believe in the power of code and design to shape the future. Our mission is to provide a dynamic and supportive digital space where developers and designers can showcase their projects, connect with peers, and continuously innovate.
              </p>
              <p>
                We aim to foster a vibrant community by celebrating the diverse talents and groundbreaking work of tech creators. Whether you're building the next big app, designing stunning UIs, or crafting elegant code, DevPortfolio Hub is your platform to shine.
              </p>
            </CardContent>
          </div>
        </div>
      </Card>

      <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-semibold text-center text-primary mb-6 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-accent" /> What We Offer
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Component, title: "Showcase Your Projects", description: "A polished gallery to display your applications, designs, and code snippets with dedicated creator profiles." },
            { icon: Users, title: "Connect & Collaborate", description: "Join a welcoming community of fellow tech creators, share feedback, and find inspiration or collaborators." },
            { icon: Terminal, title: "Engage & Grow", description: "Participate in coding challenges, discover new technologies, and keep your skills sharp." },
            { icon: Code2, title: "Developer-Friendly", description: "Our platform is designed for ease of use, allowing you to focus on what you do best: creating." },
          ].map((item, index) => (
            <Card 
              key={item.title} 
              className="shadow-md hover:shadow-lg transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><item.icon className="text-accent"/> {item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="text-center p-8 bg-gradient-to-br from-primary/10 to-accent/10 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
        <CardTitle className="text-3xl text-primary mb-4">Join Our Innovative Community</CardTitle>
        <CardDescription className="text-lg text-foreground/80 mb-6">
          Whether you're a seasoned pro or just starting your journey in tech, DevPortfolio Hub is your space to grow and get noticed.
        </CardDescription>
        <div className="space-x-4">
          <Button size="lg" asChild className="pulse-gentle">
            <Link href="/gallery">Explore Project Showcase</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/upload">Share Your Project</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
