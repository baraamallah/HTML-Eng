
import type { Project, Creator, Category, ProjectChallenge, SiteSettings } from '@/types';

export const CATEGORIES: Category[] = ['Web App', 'Mobile App', 'UI/UX Design', 'Code Snippet', 'Open Source Project'];

export const MOCK_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'DevPortfolio Hub (Mock)',
  navHomeLink: 'Home (Mock)',
  navHomeHref: '/',
  aboutPageContent: 'This is the mock about page content from constants.ts. Update me in Firestore via the admin panel!',
};

export const MOCK_CREATORS: Creator[] = [
  // Creators reset to zero as per request
];

export const MOCK_PROJECTS: Project[] = [
  // Projects reset to zero as they are linked to creators
];

export const MOCK_CHALLENGES: ProjectChallenge[] = [
  {
    id: 'challengeDev1',
    title: 'Build a Portfolio Site with Next.js',
    description: 'Create a personal portfolio website using Next.js and deploy it. Showcase your skills and projects! Must include at least 3 projects and a contact form.',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  {
    id: 'challengeDes1',
    title: 'Redesign a Popular App UI',
    description: 'Choose a popular application and redesign its user interface. Focus on improving usability and aesthetics. Present your mockups and a brief design rationale.',
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
  }
];

export const getCreatorById = (id: string): Creator | undefined => MOCK_CREATORS.find(creator => creator.id === id);
export const getProjectsByCreator = (creatorId: string): Project[] => MOCK_PROJECTS.filter(project => project.creatorId === creatorId);
export const getProjectById = (id: string): Project | undefined => MOCK_PROJECTS.find(project => project.id === id);
