
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
import { ListFilter, Palette, CalendarDays, TrendingUp, Search, Edit3, Camera, Laptop, Blend } from 'lucide-react'; // Added Edit3, Camera, Laptop, Blend


const CategoryIcon = ({ category }: { category: Category }) => {
  switch (category) {
    case 'Painting': return <Palette className="w-4 h-4 mr-2" />;
    case 'Drawing': return <Edit3 className="w-4 h-4 mr-2" />; 
    case 'Photography': return <Camera className="w-4 h-4 mr-2"/>;
    case 'Digital Art': return <Laptop className="w-4 h-4 mr-2"/>;
    case 'Mixed Media': return <Blend className="w-4 h-4 mr-2"/>;
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
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary mb-2">Art Gallery</h1>
        <p className="text-lg text-foreground/80">Explore a diverse collection of artworks from our talented artists.</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <Tabs defaultValue="All" onValueChange={(value) => setActiveCategory(value as Category | 'All')} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border border-border rounded-lg shadow-sm bg-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
        <Button variant="outline" className="w-full md:w-auto flex items-center"><Palette className="w-4 h-4 mr-2" />Filter by Color</Button>
      </div>

      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork, index) => (
            <ArtworkCard 
              key={artwork.id} 
              artwork={artwork} 
              animationDelay={`${0.4 + index * 0.05}s`}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>No artworks found matching your criteria. Try adjusting your filters or search term.</p>
      )}
    </div>
  );
}
