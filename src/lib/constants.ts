
import type { Project, Creator, Category, ProjectChallenge, SiteSettings } from '@/types';

export const CATEGORIES: Category[] = ['Web App', 'Mobile App', 'UI/UX Design', 'Code Snippet', 'Open Source Project'];

export const MOCK_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'DevPortfolio Hub (Mock)',
  navHomeLink: 'Home (Mock)',
  navHomeHref: '/',
  aboutPageContent: 'This is the mock about page content from constants.ts. Update me in Firestore via the admin panel!',
};

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'dev1',
    name: 'Zaid Naholi',
    photoUrl: '/img/creator-zaid-naholi.png',
    dataAiHint: 'male developer software engineer',
    location: 'Amman, Jordan',
    bio: 'Passionate full-stack developer specializing in Next.js and serverless solutions. Eager to build scalable and user-friendly applications.',
    statement: 'Code is poetry. I strive to write elegant and efficient solutions to complex problems.',
    githubUsername: 'zaidnaholi',
    linkedInProfile: 'https://linkedin.com/in/zaidnaholi',
    personalWebsite: 'https://zaidnaholi.dev',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj101',
    title: 'Ecoleta - Recycling Finder',
    description: 'A web and mobile application to help users find collection points for various types of recyclable materials. Built with React, Node.js, and Leaflet maps.',
    tags: ['sustainability', 'maps', 'full-stack', 'community'],
    previewImageUrl: '/img/project-ecoleta-preview.png',
    dataAiHint: 'app interface map',
    category: 'Web App',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    isFeatured: true,
    projectUrl: 'https://github.com/zaidnaholi/ecoleta-example',
    techStack: ['React', 'Node.js', 'SQLite', 'Leaflet'],
    likeCount: 125,
  },
  {
    id: 'proj103',
    title: 'Python Web Scraper for News',
    description: 'A Python script using Beautiful Soup and Requests to scrape news headlines and summaries from various sources. Includes data cleaning and export to CSV.',
    tags: ['python', 'data-scraping', 'automation', 'news-aggregation'],
    previewImageUrl: '/img/project-python-scraper-preview.png',
    dataAiHint: 'code editor terminal',
    category: 'Code Snippet',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    projectUrl: 'https://github.com/zaidnaholi/news-scraper-example',
    techStack: ['Python', 'Beautiful Soup', 'Requests'],
    likeCount: 78,
  },
   {
    id: 'proj105',
    title: 'Markdown Editor Library',
    description: 'A lightweight JavaScript library for embedding a simple Markdown editor into web pages. Features live preview and basic toolbar functionality.',
    tags: ['javascript', 'markdown', 'frontend-library', 'text-editor'],
    previewImageUrl: '/img/project-markdown-editor-preview.png',
    dataAiHint: 'web interface text editor',
    category: 'Open Source Project',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    projectUrl: 'https://github.com/zaidnaholi/markdown-editor-example',
    techStack: ['JavaScript', 'HTML', 'CSS'],
    likeCount: 42,
  },
];

// MOCK_CHALLENGES is removed as the section was removed from homepage
export const MOCK_CHALLENGES: ProjectChallenge[] = [];


export const getCreatorById = (id: string): Creator | undefined => MOCK_CREATORS.find(creator => creator.id === id);
export const getProjectsByCreator = (creatorId: string): Project[] => MOCK_PROJECTS.filter(project => project.creatorId === creatorId);
export const getProjectById = (id: string): Project | undefined => MOCK_PROJECTS.find(project => project.id === id);
