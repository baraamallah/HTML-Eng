
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Github, ExternalLink } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  animationDelay?: string;
}

const FALLBACK_IMAGE_URL = 'https://placehold.co/300x200.png?text=Image+Error';
const ALLOWED_IMAGE_HOST = 'placehold.co';

export function ProjectCard({ project, animationDelay }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(cardRef, { threshold: 0.1, freezeOnceVisible: false });
  const isObservedVisible = !!entry?.isIntersecting;

  const [isMounted, setIsMounted] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(FALLBACK_IMAGE_URL);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    let imageUrlToUse = FALLBACK_IMAGE_URL;
    if (project.previewImageUrl) {
      try {
        const url = new URL(project.previewImageUrl);
        if (url.hostname === ALLOWED_IMAGE_HOST) {
          imageUrlToUse = project.previewImageUrl;
        }
      } catch (e) {
        // Invalid URL, stick to fallback
        console.warn(`Invalid project.previewImageUrl: ${project.previewImageUrl}`);
      }
    }
    setCurrentImageUrl(imageUrlToUse);
  }, [project.previewImageUrl]);

  const showAnimation = isMounted && isObservedVisible;

  const handleImageError = () => {
    if (currentImageUrl !== FALLBACK_IMAGE_URL) {
        setCurrentImageUrl(FALLBACK_IMAGE_URL);
    }
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col h-full",
        showAnimation ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={showAnimation ? { animationDelay: animationDelay || '0s' } : { opacity: 0 }}
    >
      <CardHeader className="p-0 relative">
        <Link href={`/gallery?project=${project.id}`}>
            <Image
              src={currentImageUrl}
              alt={project.title}
              width={300}
              height={200}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
              style={{ minWidth: '300px' }}
              data-ai-hint={project.dataAiHint || "project preview"}
              onError={handleImageError}
              unoptimized={currentImageUrl !== project.previewImageUrl && currentImageUrl === FALLBACK_IMAGE_URL} // Avoid optimizing the fallback if it's already a placeholder
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
            <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
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
          <p className="text-xs text-muted-foreground mt-1 truncate" title={project.techStack.join(', ')}>
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
