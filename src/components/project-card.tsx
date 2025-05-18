
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Github, ExternalLink, Heart } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  animationDelay?: string;
  onViewDetails: (project: Project) => void;
  onLike: (projectId: string) => void; // New prop for liking
}

const FALLBACK_IMAGE_URL = 'https://placehold.co/300x200.png?text=No+Preview';
const ALLOWED_HOSTNAMES = ['placehold.co', 'firebasestorage.googleapis.com'];

export function ProjectCard({ project, animationDelay, onViewDetails, onLike }: ProjectCardProps) {
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
        if (ALLOWED_HOSTNAMES.includes(url.hostname)) {
          imageUrlToUse = project.previewImageUrl;
        } else {
          console.warn(`ProjectCard: Hostname ${url.hostname} not allowed for ${project.title}. Using fallback.`);
        }
      } catch (e) {
        console.warn(`ProjectCard: Invalid project.previewImageUrl for ${project.title}: ${project.previewImageUrl}. Using fallback.`);
      }
    }
    setCurrentImageUrl(imageUrlToUse);
  }, [project.previewImageUrl, project.title]);

  const showAnimation = isMounted && isObservedVisible;

  const handleImageError = () => {
    if (currentImageUrl !== FALLBACK_IMAGE_URL) {
        setCurrentImageUrl(FALLBACK_IMAGE_URL);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a[target="_blank"]') || (e.target as HTMLElement).closest('.like-button-area')) {
      return;
    }
    onViewDetails(project);
  };
  
  const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    onViewDetails(project);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click when liking
    onLike(project.id);
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full cursor-pointer border border-border hover:border-primary/50",
        showAnimation ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={showAnimation ? { animationDelay: animationDelay || '0s' } : { opacity: 0 }}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        <div onClick={() => onViewDetails(project)} className="cursor-pointer w-full h-[200px] relative bg-muted overflow-hidden rounded-t-lg">
            <Image
              src={currentImageUrl}
              alt={project.title}
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project.dataAiHint || "project preview"}
              onError={handleImageError}
              unoptimized={!ALLOWED_HOSTNAMES.some(host => currentImageUrl.startsWith(`https://${host}`))}
            />
        </div>
        {project.projectUrl && (
           <Button
            variant="secondary" // Changed variant for better contrast
            size="icon"
            className="absolute top-3 right-3 bg-card/80 hover:bg-card text-foreground hover:text-primary scale-90 group-hover:scale-100 transition-transform z-10 shadow-md backdrop-blur-sm"
            aria-label="View Project Live or Repository"
            asChild
            onClick={(e) => e.stopPropagation()} 
          >
            <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
              {project.projectUrl.includes('github.com') ? <Github className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
          <a onClick={handleTitleClick} className="cursor-pointer hover:underline">{project.title}</a>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          By <Link href={`/artists/${project.creatorId}`} className="hover:underline hover:text-accent" onClick={(e) => e.stopPropagation()}>{project.creatorName}</Link>
        </p>
        <p className="text-xs text-muted-foreground mt-1">Category: {project.category}</p>
        {project.techStack && project.techStack.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 truncate" title={project.techStack.join(', ')}>
            Tech: {project.techStack.join(', ')}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(project)} className="flex-grow mr-2">
          <Eye className="mr-2 h-4 w-4" />View Details
        </Button>
        <div className="flex items-center gap-1 like-button-area">
            <Button variant="ghost" size="icon" onClick={handleLikeClick} className="group rounded-full p-2 hover:bg-destructive/10">
                <Heart className="h-5 w-5 text-destructive/70 group-hover:text-destructive group-hover:fill-destructive/10 transition-all" />
            </Button>
            <span className="text-sm text-muted-foreground">{(project.likeCount || 0).toLocaleString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
