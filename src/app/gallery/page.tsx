
'use client';

import { useState } from 'react';
import Link from 'next/link'; // Ensured import
import { ProjectCard } from '@/components/project-card';
import { MOCK_PROJECTS, CATEGORIES } from '@/lib/constants';
import type { Project, Category } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ListFilter, Code2, Smartphone, DraftingCompass, FileJson, GitFork, CalendarDays, Search, LayoutGrid } from 'lucide-react';

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
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date'>('date');

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const categoryMatch = activeCategory === 'All' || project.category === activeCategory;
    const searchMatch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      <header className="text-center animate-fade-in-up">
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
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id} 
              project={project}
              animationDelay={`${0.4 + index * 0.05}s`}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>No projects found matching your criteria. Try adjusting your filters or search term.</p>
      )}
    </div>
  );
}
