
export type Category = 'Web App' | 'Mobile App' | 'UI/UX Design' | 'Code Snippet' | 'Open Source Project';

export interface Project {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  previewImageUrl: string; // Renamed from imageUrl
  dataAiHint?: string; // Kept for consistency, will be tech-focused
  category: Category;
  creatorId: string; // Renamed from artistId
  creatorName: string; // Renamed from artistName
  uploadDate: string; // ISO string
  isFeatured?: boolean;
  projectUrl?: string; // New: Link to live project or repo
  techStack?: string[]; // New: Technologies used
}

export interface Creator {
  id: string;
  name: string;
  photoUrl: string;
  dataAiHint?: string; // Kept for consistency
  location?: string;
  bio: string; // Renamed from aboutMe
  statement?: string; // Could be developer/designer philosophy
  githubUsername?: string; // New
  linkedInProfile?: string; // New
  personalWebsite?: string; // New
}

export interface ProjectChallenge { // Renamed from ArtChallenge
  id: string;
  title: string;
  description: string;
  endDate: string; // ISO string
}
