
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  animationDelay?: string;
}

export function ProjectCard({ project, animationDelay }: ProjectCardProps) {
  return (
    <Card 
      className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col h-full animate-fade-in-up"
      style={{ animationDelay: animationDelay || '0s' }}
    >
      <CardHeader className="p-0 relative">
        <Link href={`/gallery?project=${project.id}`}> {/* This could link to a modal or detailed page later */}
            <Image
              src={project.previewImageUrl}
              alt={project.title}
              width={300}
              height={200} 
              className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
              style={{ minWidth: '300px' }}
              data-ai-hint={project.dataAiHint || "project preview"}
            />
        </Link>
        {project.projectUrl && (
           <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-card/70 hover:bg-card text-primary hover:text-primary/80 scale-90 group-hover:scale-100 transition-transform"
            aria-label="View Project Live or Repository"
            asChild
          >
            <Link href={project.projectUrl} target="_blank">
              {project.projectUrl.includes('github.com') ? <Github className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
          <Link href={`/gallery?project=${project.id}`}>{project.title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          By <Link href={`/artists/${project.creatorId}`} className="hover:underline hover:text-accent">{project.creatorName}</Link>
        </p>
        <p className="text-xs text-muted-foreground mt-1">Category: {project.category}</p>
        {project.techStack && project.techStack.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Tech: {project.techStack.join(', ')}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/gallery?project=${project.id}`}><Eye className="mr-2 h-4 w-4" />View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
