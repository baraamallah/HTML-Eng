
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/project-card';
import { CATEGORIES } from '@/lib/constants';
import type { Project, Category } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ListFilter, Code2, Smartphone, DraftingCompass, FileJson, GitFork, CalendarDays, Search, LayoutGrid, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase'; // Import Firestore instance
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const CategoryIcon = ({ category }: { category: Category }) => {
  switch (category) {
    case 'Web App': return <Code2 className="w-4 h-4 mr-2 text-primary/80" />;
    case 'Mobile App': return <Smartphone className="w-4 h-4 mr-2 text-primary/80" />;
    case 'UI/UX Design': return <DraftingCompass className="w-4 h-4 mr-2 text-primary/80" />;
    case 'Code Snippet': return <FileJson className="w-4 h-4 mr-2 text-primary/80" />;
    case 'Open Source Project': return <GitFork className="w-4 h-4 mr-2 text-primary/80" />;
    default: return <LayoutGrid className="w-4 h-4 mr-2 text-primary/80" />;
  }
};

export default function GalleryPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date'>('date'); // Defaulting to 'date', can add more like 'popularity' later

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setFetchError(null);
      try {
        const projectsRef = collection(db, 'projects');
        // Order by 'createdAt' if available and a server timestamp, otherwise 'uploadDate'
        // For this example, let's assume 'createdAt' is a server timestamp or a reliable ISO string.
        // If 'createdAt' is not consistently set, 'uploadDate' (ISO string) might be safer.
        const q = query(projectsRef, orderBy('createdAt', 'desc')); // Or orderBy('uploadDate', 'desc')
        
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
      // Ensure consistent date comparison, assuming 'createdAt' or 'uploadDate' exists
      const dateA = a.createdAt ? new Date(typeof a.createdAt === 'string' ? a.createdAt : (a.createdAt as any).toDate()).getTime() : new Date(a.uploadDate).getTime();
      const dateB = b.createdAt ? new Date(typeof b.createdAt === 'string' ? b.createdAt : (b.createdAt as any).toDate()).getTime() : new Date(b.uploadDate).getTime();
      return dateB - dateA;
    }
    // Add other sort criteria later if needed
    return 0;
  });

  return (
    <div className="space-y-8">
      <header className="text-center animate-fade-in-up">
        <LayoutGrid className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-4xl font-bold text-primary mb-2">Project Showcase</h1>
        <p className="text-lg text-foreground/80">Explore a diverse collection of projects from our talented creators.</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <Tabs defaultValue="All" onValueChange={(value) => setActiveCategory(value as Category | 'All')} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="All" className="flex items-center justify-center"><ListFilter className="w-4 h-4 mr-2 text-primary/80"/>All</TabsTrigger>
          {CATEGORIES.map(category => (
            <TabsTrigger key={category} value={category} className="flex items-center justify-center">
              <CategoryIcon category={category} />
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
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date" className="flex items-center"><CalendarDays className="w-4 h-4 mr-2" />Date Added</SelectItem>
            {/* Add more sort options here if needed */}
          </SelectContent>
        </Select>
      </div>

      {isLoadingProjects && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {fetchError && !isLoadingProjects && (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up bg-destructive/10 p-6 rounded-lg">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-lg text-destructive font-semibold">Error Loading Projects</p>
          <p className="text-muted-foreground">{fetchError}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Try Reloading
          </Button>
        </div>
      )}

      {!isLoadingProjects && !fetchError && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id} 
              project={project}
              animationDelay={`${0.4 + index * 0.05}s`}
            />
          ))}
        </div>
      )}

      {!isLoadingProjects && !fetchError && filteredProjects.length === 0 && allProjects.length > 0 && (
         <p className="text-center text-muted-foreground py-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>No projects found matching your criteria. Try adjusting your filters or search term.</p>
      )}
      
      {!isLoadingProjects && !fetchError && allProjects.length === 0 && (
        <Card className="text-center p-8 bg-muted/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Showcase is Empty!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground/80 mb-6">
              No projects have been shared yet. Be the first to contribute!
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button size="lg" asChild className="pulse-gentle">
              <Link href="/upload">Share Your Project</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
