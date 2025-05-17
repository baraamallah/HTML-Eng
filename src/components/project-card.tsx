
'use client';

import Image from 'next/image';
import Link from 'next/link'; // Ensured Link is imported
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
  onViewDetails: (project: Project) => void; // New prop for modal
}

const FALLBACK_IMAGE_URL = 'https://placehold.co/300x200.png?text=No+Preview';
const ALLOWED_HOSTNAMES = ['placehold.co']; // Only allow placehold.co for direct processing

export function ProjectCard({ project, animationDelay, onViewDetails }: ProjectCardProps) {
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
          // If hostname is not allowed, immediately use fallback.
          // This prevents next/image from trying to process unconfigured hosts.
          console.warn(`Hostname ${url.hostname} not in allowed list. Using fallback for ${project.title}.`);
        }
      } catch (e) {
        // Invalid URL, stick to fallback
        console.warn(`Invalid project.previewImageUrl: ${project.previewImageUrl}. Using fallback for ${project.title}.`);
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
    // Prevent click if it's on the external link button
    if ((e.target as HTMLElement).closest('a[target="_blank"]')) {
      return;
    }
    onViewDetails(project);
  };
  
  const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link navigation
    onViewDetails(project);
  };


  return (
    <Card
      ref={cardRef}
      className={cn(
        "group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col h-full cursor-pointer",
        showAnimation ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={showAnimation ? { animationDelay: animationDelay || '0s' } : { opacity: 0 }}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        {/* Image itself can also trigger details */}
        <div onClick={() => onViewDetails(project)} className="cursor-pointer w-full h-[200px] relative"> {/* Fixed height container */}
            <Image
              src={currentImageUrl}
              alt={project.title}
              fill // Use fill to cover the container
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={project.dataAiHint || "project preview"}
              onError={handleImageError}
              unoptimized={!ALLOWED_HOSTNAMES.some(host => currentImageUrl.startsWith(`https://${host}`))}
            />
        </div>
        {project.projectUrl && (
           <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-card/70 hover:bg-card text-primary hover:text-primary/80 scale-90 group-hover:scale-100 transition-transform z-10"
            aria-label="View Project Live or Repository"
            asChild
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking this button
          >
            <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
              {project.projectUrl.includes('github.com') ? <Github className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
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
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(project)} className="w-full">
          <Eye className="mr-2 h-4 w-4" />View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
