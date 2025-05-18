
'use client';

import { useState, useEffect } from 'react';
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
import { ListFilter, Code2, Smartphone, DraftingCompass, FileJson, GitFork, CalendarDays, Search, LayoutGrid, Loader2, AlertCircle, ExternalLink, UserCircle, Github, Heart } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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
const ALLOWED_MODAL_HOSTNAMES = ['placehold.co', 'firebasestorage.googleapis.com'];

export default function GalleryPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date'>('date'); // 'date' or 'likes' could be an option later

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(FALLBACK_MODAL_IMAGE_URL);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setFetchError(null);
      try {
        const projectsRef = collection(db, 'projects');
        // Assuming createdAt field exists and is a Firestore Timestamp for ordering
        const q = query(projectsRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setAllProjects(fetchedProjects);
      } catch (error: any) {
        console.error("Error fetching projects: ", error);
        setFetchError(`Failed to load projects: ${error.message}. Please try again later.`);
        toast({
          title: 'Error Loading Projects',
          description: `Could not fetch projects from Firestore: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleViewProjectDetails = (project: Project) => {
    setSelectedProject(project);
    let imageUrlToUseInModal = FALLBACK_MODAL_IMAGE_URL;
    if (project.previewImageUrl) {
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
  
  const handleLikeProject = (projectId: string) => {
    // This is a conceptual UI-only update.
    // In a real app, you would update Firestore and then refresh the state.
    setAllProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p
      )
    );
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, likeCount: (prev.likeCount || 0) + 1 } : null);
    }
    toast({
      title: "Project Liked!",
      description: "Note: Likes are not saved in this demo version.",
      duration: 3000,
    });
    // TODO: Add actual Firestore update logic here in a real application
    // Example:
    // const projectRef = doc(db, 'projects', projectId);
    // await updateDoc(projectRef, {
    //   likeCount: increment(1)
    // });
  };


  const filteredProjects = allProjects.filter(project => {
    const categoryMatch = activeCategory === 'All' || project.category === activeCategory;
    const searchMatch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      // Ensure createdAt is a valid Date object or can be converted to one
      const dateA = a.createdAt ? (typeof a.createdAt === 'string' ? new Date(a.createdAt) : (a.createdAt as any).toDate ? (a.createdAt as any).toDate() : new Date(a.uploadDate)) : new Date(a.uploadDate);
      const dateB = b.createdAt ? (typeof b.createdAt === 'string' ? new Date(b.createdAt) : (b.createdAt as any).toDate ? (b.createdAt as any).toDate() : new Date(b.uploadDate)) : new Date(b.uploadDate);
      return dateB.getTime() - dateA.getTime();
    }
    // Add sorting by likes if needed in the future
    return 0;
  });

  return (
    <div className="space-y-10">
      <header className="text-center animate-fade-in-up">
        <LayoutGrid className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-5xl font-bold text-primary mb-3">Project Showcase</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">Explore a diverse collection of projects from our talented creators.</p>
        <BrushStrokeDivider className="mx-auto mt-6 h-6 w-36 text-primary/50" />
      </header>

      <Tabs defaultValue="All" onValueChange={(value) => setActiveCategory(value as Category | 'All')} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2 bg-card rounded-lg shadow-md border border-border">
          <TabsTrigger value="All" className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-primary/10 data-[state=active]:hover:bg-primary/90 transition-all duration-200 rounded-md">
            <ListFilter className="w-5 h-5"/>All Projects
          </TabsTrigger>
          {CATEGORIES.map(category => (
            <TabsTrigger key={category} value={category} className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-primary/10 data-[state=active]:hover:bg-primary/90 transition-all duration-200 rounded-md">
              <CategoryIcon category={category} className="w-5 h-5"/>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
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
            {/* Future: <SelectItem value="likes">Most Liked</SelectItem> */}
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
            <div className="flex-grow overflow-y-auto space-y-6 p-1 pr-3"> {/* Added p-1 pr-3 for scrollbar spacing */}
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
                  <Heart className="w-6 h-6 text-destructive/70 group-hover:text-destructive group-hover:fill-destructive/20 transition-all"/>
                </Button>
                <span className="text-lg text-muted-foreground">{(selectedProject.likeCount || 0).toLocaleString()} Likes</span>
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
