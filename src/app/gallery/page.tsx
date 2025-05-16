'use client';

import { useState } from 'react';
import { ArtworkCard } from '@/components/artwork-card';
import { MOCK_ARTWORKS, CATEGORIES } from '@/lib/constants';
import type { Artwork, Category } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListFilter, Palette, CalendarDays, TrendingUp, Search } from 'lucide-react';


const CategoryIcon = ({ category }: { category: Category }) => {
  switch (category) {
    case 'Painting': return <Palette className="w-4 h-4 mr-2" />;
    case 'Drawing': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-tool mr-2"><path d="path_to_pen_tool_icon"/></svg>; // Placeholder, replace with actual PenTool icon or similar
    case 'Photography': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera mr-2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
    case 'Digital Art': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laptop mr-2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.7 20H3.3a1 1 0 0 1-.58-1.45L4 16"/></svg>;
    case 'Mixed Media': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-blend mr-2"><path d="path_to_blend_icon"/></svg>; // Placeholder
    default: return null;
  }
};


export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');

  const filteredArtworks = MOCK_ARTWORKS.filter(artwork => {
    const categoryMatch = activeCategory === 'All' || artwork.category === activeCategory;
    const searchMatch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        artwork.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        artwork.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    }
    // Popularity sort logic would go here if we had scores
    return 0;
  });

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Art Gallery</h1>
        <p className="text-lg text-foreground/80">Explore a diverse collection of artworks from our talented artists.</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <Tabs defaultValue="All" onValueChange={(value) => setActiveCategory(value as Category | 'All')}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="All" className="flex items-center justify-center"><ListFilter className="w-4 h-4 mr-2"/>All</TabsTrigger>
          {CATEGORIES.map(category => (
            <TabsTrigger key={category} value={category} className="flex items-center justify-center">
              <CategoryIcon category={category} />
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border border-border rounded-lg shadow-sm bg-card">
        <div className="relative flex-grow">
          <Input 
            type="search" 
            placeholder="Search by title, artist, or tag..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'popularity')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date" className="flex items-center"><CalendarDays className="w-4 h-4 mr-2" />Date Added</SelectItem>
            <SelectItem value="popularity" className="flex items-center"><TrendingUp className="w-4 h-4 mr-2" />Popularity</SelectItem>
          </SelectContent>
        </Select>
        {/* Placeholder for color palette filter */}
        <Button variant="outline" className="w-full md:w-auto flex items-center"><Palette className="w-4 h-4 mr-2" />Filter by Color</Button>
      </div>

      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">No artworks found matching your criteria. Try adjusting your filters or search term.</p>
      )}
    </div>
  );
}
