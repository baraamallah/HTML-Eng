
import Image from 'next/image';
import Link from 'next/link';
import { getCreatorById, getProjectsByCreator, MOCK_CREATORS } from '@/lib/constants';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Mail, MapPin, Info, CodeXml, MessageSquareQuote, Github, Linkedin, Globe } from 'lucide-react';
import { notFound } from 'next/navigation';

interface CreatorProfilePageProps {
  params: { artistId: string }; // artistId used for route, maps to creatorId
}

export function generateStaticParams() {
  return MOCK_CREATORS.map(creator => ({
    artistId: creator.id,
  }));
}

export default function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const creator = getCreatorById(params.artistId);
  if (!creator) {
    notFound();
  }
  const projects = getProjectsByCreator(params.artistId);

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden shadow-xl animate-fade-in-up">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 bg-accent/10 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-lg mb-4">
              <Image
                src={creator.photoUrl}
                alt={creator.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={creator.dataAiHint || "creator photo"}
              />
            </div>
            <h1 className="text-3xl font-bold text-primary text-center">{creator.name}</h1>
            {creator.location && (
              <p className="text-muted-foreground text-center mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {creator.location}
              </p>
            )}
            <div className="mt-4 flex space-x-3">
              {creator.githubUsername && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`https://github.com/${creator.githubUsername}`} target="_blank" rel="noopener noreferrer" aria-label={`${creator.name}'s GitHub Profile`}>
                    <Github className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              {creator.linkedInProfile && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={creator.linkedInProfile} target="_blank" rel="noopener noreferrer" aria-label={`${creator.name}'s LinkedIn Profile`}>
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              {creator.personalWebsite && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={creator.personalWebsite} target="_blank" rel="noopener noreferrer" aria-label={`${creator.name}'s Personal Website`}>
                    <Globe className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
             <Button variant="outline" className="mt-6 pulse-gentle">
              <Mail className="mr-2 h-4 w-4" /> Contact Creator
            </Button>
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-accent"><Info className="w-6 h-6" /> About Me</h2>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{creator.bio}</p>
            </section>
            {creator.statement && (
              <>
                <BrushStrokeDivider className="my-6 h-4 w-24 text-primary/30" />
                <section>
                  <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-accent"><MessageSquareQuote className="w-6 h-6" /> Developer/Designer Statement</h2>
                  <blockquote className="italic text-foreground/80 border-l-4 border-accent pl-4 py-2 leading-relaxed">
                    {creator.statement}
                  </blockquote>
                </section>
              </>
            )}
          </div>
        </div>
      </Card>

      <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><CodeXml className="w-8 h-8 text-accent"/> Project Portfolio</h2>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id} 
                project={project}
                animationDelay={`${0.3 + index * 0.1}s`} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">This creator hasn't uploaded any projects yet.</p>
        )}
      </section>
    </div>
  );
}

