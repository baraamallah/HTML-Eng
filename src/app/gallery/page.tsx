
'use client';

import { useState, useEffect, type SetStateAction } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectCard } from '@/components/project-card';
import { CATEGORIES } from '@/lib/constants';
import type { Project, Category } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ListFilter, Code2, Smartphone, DraftingCompass, FileJson, GitFork, CalendarDays, Search, LayoutGrid, Loader2, AlertCircle, ExternalLink, UserCircle, Github, Heart } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';

const CategoryIcon = ({ category, className }: { category: Category, className?: string }) => {
  const iconProps = { className: className || "w-5 h-5" };
  switch (category) {
    case 'Web App': return <Code2 {...iconProps} />;
    case 'Mobile App': return <Smartphone {...iconProps} />;
    case 'UI/UX Design': return <DraftingCompass {...iconProps} />;
    case 'Code Snippet': return <FileJson {...iconProps} />;
    case 'Open Source Project': return <GitFork {...iconProps} />;
    default: return <LayoutGrid {...iconProps} />;
  }
};

const FALLBACK_MODAL_IMAGE_URL = 'https://placehold.co/800x450.png?text=Preview+Error';
const FALLBACK_CARD_IMAGE_URL = 'https://placehold.co/300x200.png?text=No+Preview';
const ALLOWED_MODAL_HOSTNAMES = ['placehold.co', 'firebasestorage.googleapis.com'];

interface ToastMessage {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
}

export default function GalleryPage() {
  const [user] = useAuthState(auth);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();
  const [toastMessageContent, setToastMessageContent] = useState<ToastMessage | null>(null);

  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date'>('date'); // Only 'date' sort is functional

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(FALLBACK_MODAL_IMAGE_URL);
  const [likedProjectIds, setLikedProjectIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setFetchError(null);
      setToastMessageContent(null);
      try {
        const projectsRef = collection(db, 'projects');
        let q;
        // Assuming 'createdAt' field exists and is a Firestore Timestamp
        if (sortBy === 'date') {
          q = query(projectsRef, orderBy('createdAt', 'desc'));
        } else {
          q = query(projectsRef); 
        }
        
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled Project",
            description: data.description || "No description provided.",
            tags: Array.isArray(data.tags) ? data.tags : [],
            previewImageUrl: data.previewImageUrl || FALLBACK_CARD_IMAGE_URL,
            dataAiHint: data.dataAiHint || "project preview",
            category: data.category || "Web App", // Default category
            creatorId: data.creatorId || "unknown_creator",
            creatorName: data.creatorName || "Unknown Creator",
            uploadDate: data.uploadDate || new Date().toISOString(),
            isFeatured: data.isFeatured || false,
            projectUrl: data.projectUrl || "",
            techStack: Array.isArray(data.techStack) ? data.techStack : [],
            likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
            createdAt: data.createdAt || null, // Handle if createdAt is missing
          } as Project;
        });
        setAllProjects(fetchedProjects);
      } catch (error: any) {
        console.error("Error fetching projects: ", error);
        const errorMessage = `Failed to load projects: ${error.message}. Please check Firestore rules or network.`;
        setFetchError(errorMessage);
        setToastMessageContent({
          title: 'Error Loading Projects',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [sortBy]);

   useEffect(() => {
    if (toastMessageContent) {
      setTimeout(() => { // Defer toast call
        toast({
          title: toastMessageContent.title,
          description: toastMessageContent.description,
          variant: toastMessageContent.variant,
        });
        setToastMessageContent(null); // Reset after showing
      }, 0);
    }
  }, [toastMessageContent, toast]);


  const handleViewProjectDetails = (project: Project) => {
    setSelectedProject(project);
    let imageUrlToUseInModal = FALLBACK_MODAL_IMAGE_URL;
    if (project.previewImageUrl && project.previewImageUrl !== FALLBACK_CARD_IMAGE_URL) {
      try {
        const url = new URL(project.previewImageUrl);
        if (ALLOWED_MODAL_HOSTNAMES.includes(url.hostname)) {
          imageUrlToUseInModal = project.previewImageUrl;
        } else {
          console.warn(`Modal: Hostname ${url.hostname} not allowed for ${project.title}. Using fallback.`);
        }
      } catch (e) {
        console.warn(`Modal: Invalid project.previewImageUrl for ${project.title}: ${project.previewImageUrl}. Using fallback.`);
      }
    }
    setModalImageUrl(imageUrlToUseInModal);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProject(null);
  };
  
  const handleLikeProject = async (projectId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to like projects.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const projectRef = doc(db, "projects", projectId);
    let likeChange = 0;
    let toastTitle = "";
    let toastDescription = "";

    const newLikedIds = new Set(likedProjectIds);
    if (newLikedIds.has(projectId)) {
      newLikedIds.delete(projectId);
      likeChange = -1; // Decrement
      toastTitle = "Project Unliked";
      toastDescription = "Your unlike has been recorded.";
    } else {
      newLikedIds.add(projectId);
      likeChange = 1; // Increment
      toastTitle = "Project Liked!";
      toastDescription = "Thanks for your feedback!";
    }
    setLikedProjectIds(newLikedIds);

    setAllProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) + likeChange) } : p
      )
    );
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, likeCount: Math.max(0, (prev.likeCount || 0) + likeChange) } : null);
    }
    
    try {
      await updateDoc(projectRef, {
        likeCount: increment(likeChange)
      });
      toast({ title: toastTitle, description: `${toastDescription} Like count updated.`, duration: 2000 });
    } catch (error: any) {
      console.error("Error updating like count: ", error);
      toast({
        title: "Error",
        description: `Could not update like: ${error.message}`,
        variant: "destructive",
      });
      // Revert optimistic UI update on error
      const revertedLikedIds = new Set(likedProjectIds);
      if (likeChange === 1) revertedLikedIds.delete(projectId); // Was an add, so remove
      else if (likeChange === -1) revertedLikedIds.add(projectId); // Was a remove, so add back
      setLikedProjectIds(revertedLikedIds);

      setAllProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) - likeChange) } : p
        )
      );
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, likeCount: Math.max(0, (prev.likeCount || 0) - likeChange) } : null);
      }
    }
  };

  const filteredProjects = allProjects.filter(project => {
    const categoryMatch = activeCategory === 'All' || project.category === activeCategory;
    const searchMatch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  return (
    <div className="space-y-10">
      <header className="text-center animate-fade-in-up">
        <LayoutGrid className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-5xl font-bold text-primary mb-3">Project Showcase</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">Explore a diverse collection of projects from our talented creators.</p>
        <BrushStrokeDivider className="mx-auto mt-6 h-6 w-36 text-primary/50" />
      </header>

      <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
         <Tabs defaultValue="All" onValueChange={(value) => setActiveCategory(value as Category | 'All')} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:inline-flex md:grid-cols-none lg:grid-cols-6 gap-1 p-1 bg-muted rounded-lg shadow-inner">
            <TabsTrigger value="All" className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 transition-colors duration-150 rounded-md">
              <ListFilter className="w-5 h-5"/>All Projects
            </TabsTrigger>
            {CATEGORIES.map(category => (
              <TabsTrigger key={category} value={category} className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 transition-colors duration-150 rounded-md">
                <CategoryIcon category={category} className="w-5 h-5"/>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border border-border rounded-lg shadow-sm bg-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="relative flex-grow">
          <Input 
            type="search" 
            placeholder="Search by title, creator, tag, or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 text-base"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date')}>
          <SelectTrigger className="w-full md:w-[200px] h-11 text-base">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date" className="flex items-center text-base py-2"><CalendarDays className="w-4 h-4 mr-2" />Most Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingProjects && (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
          <p className="text-xl text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {fetchError && !isLoadingProjects && (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up bg-destructive/10 p-8 rounded-lg shadow-lg">
          <AlertCircle className="h-16 w-16 text-destructive mb-6" />
          <p className="text-xl text-destructive font-semibold mb-2">Error Loading Projects</p>
          <p className="text-muted-foreground mb-6">{fetchError}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="lg">
            Try Reloading
          </Button>
        </div>
      )}

      {!isLoadingProjects && !fetchError && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id} 
              project={project}
              animationDelay={`${0.4 + index * 0.05}s`}
              onViewDetails={handleViewProjectDetails}
              onLike={handleLikeProject}
              isLiked={likedProjectIds.has(project.id)}
            />
          ))}
        </div>
      )}

      {!isLoadingProjects && !fetchError && filteredProjects.length === 0 && allProjects.length > 0 && (
         <p className="text-center text-lg text-muted-foreground py-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>No projects found matching your criteria. Try adjusting your filters or search term.</p>
      )}
      
      {!isLoadingProjects && !fetchError && allProjects.length === 0 && (
        <Card className="text-center p-10 bg-card/80 animate-fade-in-up shadow-lg" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <LayoutGrid className="mx-auto h-16 w-16 text-primary/70 mb-4" />
            <CardTitle className="text-3xl text-primary">Showcase is Empty!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-foreground/80 mb-8">
              No projects have been shared yet. Be the first to contribute!
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button size="lg" asChild className="pulse-gentle text-lg py-3 px-8">
              <Link href="/upload">Share Your Project</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {selectedProject && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-3xl text-primary font-bold">{selectedProject.title}</DialogTitle>
              <DialogDescription className="text-md text-muted-foreground">
                Category: {selectedProject.category}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto space-y-6 p-1 pr-3">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-2xl mt-2 bg-muted">
                <Image
                  src={modalImageUrl}
                  alt={selectedProject.title}
                  layout="fill"
                  objectFit="contain"
                  data-ai-hint={selectedProject.dataAiHint || "project details"}
                  onError={() => { setModalImageUrl(FALLBACK_MODAL_IMAGE_URL); }}
                  unoptimized={!ALLOWED_MODAL_HOSTNAMES.some(host => modalImageUrl.startsWith(`https://${host}`))}
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-2 text-accent flex items-center"><UserCircle className="w-6 h-6 mr-2" />Creator</h3>
                 <Link href={`/artists/${selectedProject.creatorId}`} className="text-primary hover:underline text-lg">
                    {selectedProject.creatorName}
                </Link>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-2 text-accent">Description</h3>
                <p className="text-foreground/90 whitespace-pre-line text-base leading-relaxed">{selectedProject.description || "No description provided."}</p>
              </div>

              {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-accent">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map(tech => <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">{tech}</Badge>)}
                  </div>
                </div>
              )}

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-accent">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(tag => <Badge key={tag} className="text-sm px-3 py-1">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between items-center pt-4 border-t gap-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleLikeProject(selectedProject.id)} className="group">
                  <Heart className={`w-6 h-6 transition-all duration-150 ease-in-out group-hover:text-destructive ${likedProjectIds.has(selectedProject.id) ? 'fill-destructive text-destructive' : 'text-destructive/70'}`}/>
                </Button>
                <span className="text-lg text-muted-foreground">{selectedProject.likeCount.toLocaleString()} Likes</span>
              </div>
              <div className="flex gap-2">
                {selectedProject.projectUrl && (
                  <Button asChild size="lg">
                    <Link href={selectedProject.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      {selectedProject.projectUrl.includes('github.com') ? <Github className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                      View Project / Source
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="lg" onClick={handleCloseDetailModal}>Close</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
