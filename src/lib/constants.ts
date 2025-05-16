import type { Artwork, Artist, Category, ArtChallenge } from '@/types';

export const CATEGORIES: Category[] = ['Drawing', 'Painting', 'Photography', 'Digital Art', 'Mixed Media'];

export const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    photoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'senior woman smiling',
    location: 'Willow Creek, CA',
    aboutMe: 'A retired teacher who found her passion for watercolors in her seventies. Loves capturing landscapes and the beauty of nature.',
    statement: 'Art is a window to the soul, and I hope my paintings bring a little peace and joy to yours.',
  },
  {
    id: '2',
    name: 'Arthur Jenkins',
    photoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'senior man painting',
    location: 'Sunnyvale, FL',
    aboutMe: 'Former engineer, now a digital art enthusiast. I enjoy creating abstract pieces that explore color and form.',
    statement: 'Technology allows us to express creativity in new and exciting ways. I embrace the digital canvas!',
  },
];

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '101',
    title: 'Sunset Over the Lake',
    description: 'A vibrant watercolor painting capturing the fiery hues of a sunset reflecting on calm lake waters.',
    tags: ['sunset', 'lake', 'watercolor', 'landscape', 'nature'],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'sunset lake',
    category: 'Painting',
    artistId: '1',
    artistName: 'Eleanor Vance',
    uploadDate: new Date(2023, 5, 15).toISOString(),
    isFeatured: true,
  },
  {
    id: '102',
    title: 'Geometric Dreams',
    description: 'A digital artwork exploring geometric patterns and bold color contrasts, created using Procreate.',
    tags: ['digital art', 'abstract', 'geometric', 'colorful', 'modern'],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'abstract geometric',
    category: 'Digital Art',
    artistId: '2',
    artistName: 'Arthur Jenkins',
    uploadDate: new Date(2023, 6, 20).toISOString(),
  },
  {
    id: '103',
    title: 'Charcoal Portrait of Grace',
    description: 'A detailed charcoal drawing capturing the expressive face of a young woman.',
    tags: ['charcoal', 'portrait', 'drawing', 'monochrome', 'expression'],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'charcoal portrait',
    category: 'Drawing',
    artistId: '1',
    artistName: 'Eleanor Vance',
    uploadDate: new Date(2023, 7, 1).toISOString(),
  },
  {
    id: '104',
    title: 'Mountain Majesty',
    description: 'A stunning photograph of a snow-capped mountain range under a clear blue sky.',
    tags: ['photography', 'mountain', 'landscape', 'snow', 'nature'],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'mountain landscape',
    category: 'Photography',
    artistId: '2',
    artistName: 'Arthur Jenkins',
    uploadDate: new Date(2023, 8, 10).toISOString(),
    isFeatured: true,
  },
  {
    id: '105',
    title: 'Collage of Memories',
    description: 'A mixed media piece incorporating old photographs, fabric scraps, and painted elements to evoke nostalgia.',
    tags: ['mixed media', 'collage', 'nostalgia', 'memory', 'texture'],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'mixed media collage',
    category: 'Mixed Media',
    artistId: '1',
    artistName: 'Eleanor Vance',
    uploadDate: new Date(2023, 9, 5).toISOString(),
  },
];

export const MOCK_CHALLENGES: ArtChallenge[] = [
  {
    id: 'challenge1',
    title: 'Sunset Colors',
    description: 'Capture the beauty of a sunset in your chosen medium. Show us those warm oranges, reds, and purples!',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  {
    id: 'challenge2',
    title: 'Monochrome Magic',
    description: 'Create an artwork using only shades of a single color or black and white. Explore the power of light and shadow.',
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
  }
];

export const getArtistById = (id: string): Artist | undefined => MOCK_ARTISTS.find(artist => artist.id === id);
export const getArtworksByArtist = (artistId: string): Artwork[] => MOCK_ARTWORKS.filter(artwork => artwork.artistId === artistId);
export const getArtworkById = (id: string): Artwork | undefined => MOCK_ARTWORKS.find(artwork => artwork.id === id);

