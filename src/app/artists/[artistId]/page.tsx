
import Image from 'next/image';
import Link from 'next/link';
import { getCreatorById, getProjectsByCreator, MOCK_CREATORS } from '@/lib/constants'; // Updated imports
import { ProjectCard } from '@/components/project-card'; // Renamed from ArtworkCard
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Mail, MapPin, Info, CodeXml, MessageSquareQuote, Github, Linkedin, Globe } from 'lucide-react'; // Updated icons
import { notFound } from 'next/navigation';

interface CreatorProfilePageProps { // Renamed from ArtistProfilePageProps
  params: { artistId: string }; // Keeping artistId for route compatibility, ideally creatorId
}

export function generateStaticParams() {
  return MOCK_CREATORS.map(creator => ({ // Changed artist to creator
    artistId: creator.id,
  }));
}

export default function CreatorProfilePage({ params }: CreatorProfilePageProps) { // Renamed
  const creator = getCreatorById(params.artistId); // Changed artist to creator
  if (!creator) {
    notFound();
  }
  const projects = getProjectsByCreator(params.artistId); // Changed artworks to projects

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
                data-ai-hint={creator.dataAiHint || "creator photo"} // Updated data-ai-hint
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
                  <Link href={`https://github.com/${creator.githubUsername}`} target="_blank" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              {creator.linkedInProfile && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={creator.linkedInProfile} target="_blank" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              {creator.personalWebsite && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={creator.personalWebsite} target="_blank" aria-label="Personal Website">
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
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{creator.bio}</p> {/* Changed aboutMe to bio, added whitespace-pre-line */}
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
        <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><CodeXml className="w-8 h-8 text-accent"/> Project Portfolio</h2> {/* Updated title and icon */}
        {projects.length > 0 ? ( // Renamed artworks to projects
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => ( // Renamed artwork to project
              <ProjectCard // Renamed ArtworkCard to ProjectCard
                key={project.id} 
                project={project} // Renamed artwork to project
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
