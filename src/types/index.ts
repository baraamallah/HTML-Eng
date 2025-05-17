
export type Category = 'Web App' | 'Mobile App' | 'UI/UX Design' | 'Code Snippet' | 'Open Source Project';

export interface Project {
  id: string; // Firestore document ID
  title: string;
  description?: string;
  tags?: string[];
  previewImageUrl: string; // URL to the image
  dataAiHint?: string;
  category: Category;
  creatorId: string; // Firebase Auth UID of the creator
  creatorName: string; // Name of the creator
  uploadDate: string; // ISO string
  isFeatured?: boolean;
  projectUrl?: string; // Link to live project, repo, or Figma file
  techStack?: string[]; // Technologies used
}

export interface Creator {
  id: string; // Firestore document ID (ideally same as Firebase Auth UID)
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

export interface SiteSettings {
  siteTitle: string;
  navHomeLink: string;
  navHomeHref: string;
  aboutPageContent: string;
}
