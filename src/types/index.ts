export type Category = 'Drawing' | 'Painting' | 'Photography' | 'Digital Art' | 'Mixed Media';

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  imageUrl: string;
  category: Category;
  artistId: string;
  artistName: string; // Denormalized for convenience
  uploadDate: string; // ISO string
  isFeatured?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  photoUrl: string;
  location?: string;
  aboutMe: string;
  statement?: string;
}

export interface ArtChallenge {
  id: string;
  title: string;
  description: string;
  endDate: string; // ISO string
}
