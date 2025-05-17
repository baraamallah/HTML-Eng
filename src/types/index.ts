
export type Category = 'Web App' | 'Mobile App' | 'UI/UX Design' | 'Code Snippet' | 'Open Source Project';

export interface Project {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  previewImageUrl: string;
  dataAiHint?: string;
  category: Category;
  creatorId: string;
  creatorName: string;
  uploadDate: string; // ISO string
  isFeatured?: boolean;
  projectUrl?: string; // Link to live project, repo, or Figma file
  techStack?: string[]; // Technologies used
}

export interface Creator {
  id: string;
  name: string;
  photoUrl: string;
  dataAiHint?: string;
  location?: string;
  bio: string;
  statement?: string;
  githubUsername?: string;
  linkedInProfile?: string; // Full URL
  personalWebsite?: string; // Full URL
}

export interface ProjectChallenge {
  id: string;
  title: string;
  description: string;
  endDate: string; // ISO string
}

