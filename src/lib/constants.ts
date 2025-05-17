
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
    id: 'dev1', // This ID should ideally match a Firebase Auth UID for consistency if used as a fallback
    name: 'Zaid Naholi',
    photoUrl: '/img/creator-zaid-naholi.png',
    dataAiHint: 'male developer',
    location: 'Silicon Valley, CA',
    bio: 'Full-stack developer with a passion for creating intuitive web applications. Loves Next.js and serverless architectures. Specializes in React, TypeScript, and Node.js. Avid open-source contributor.',
    statement: 'Code is my canvas. I strive to build software that is not only functional but also a joy to use, accessible to everyone, and performs reliably under pressure.',
    githubUsername: 'zaidnaholi-mock', // Updated for clarity
    linkedInProfile: 'https://www.linkedin.com/in/zaidnaholi-mock',
    personalWebsite: 'https://zaidnaholi-mock.dev',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj101',
    title: 'Ecoleta - Recycling Finder (Mock)',
    description: 'A web application helping users find nearby recycling points for various materials. Built with Next.js, TypeScript, and Mapbox. Features include user authentication, location-based search, and contribution of new collection points.',
    tags: ['web app', 'nextjs', 'typescript', 'sustainability', 'maps', 'full-stack'],
    previewImageUrl: '/img/project-ecoleta-preview.png',
    dataAiHint: 'app map',
    category: 'Web App',
    creatorId: 'dev1', // Corresponds to Zaid Naholi's mock ID
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(2023, 8, 15).toISOString(),
    isFeatured: true,
    projectUrl: 'https://github.com/zaidnaholi-mock/ecoleta-mock',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Mapbox API', 'Firebase'],
  },
  {
    id: 'proj103',
    title: 'Python Web Scraper for News (Mock)',
    description: 'A Python script that scrapes headlines from various news websites using BeautifulSoup and Requests. Includes error handling and data export to CSV format.',
    tags: ['python', 'web scraping', 'automation', 'script', 'data', 'cli'],
    previewImageUrl: '/img/project-python-scraper-preview.png',
    dataAiHint: 'code editor',
    category: 'Code Snippet',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(2023, 10, 1).toISOString(),
    projectUrl: 'https://gist.github.com/zaidnaholi-mock/mock-scraper-gist',
    techStack: ['Python', 'BeautifulSoup', 'Requests'],
  },
  {
    id: 'proj105',
    title: 'Markdown Editor Library (Mock)',
    description: 'A lightweight, embeddable Markdown editor component built with Svelte. Features real-time preview, toolbar customization, and plugin support. Open source and community-driven.',
    tags: ['open source', 'javascript', 'markdown', 'library', 'svelte', 'wysiwyg'],
    previewImageUrl: '/img/project-markdown-editor-preview.png',
    dataAiHint: 'web interface',
    category: 'Open Source Project',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(2024, 0, 5).toISOString(),
    projectUrl: 'https://github.com/zaidnaholi-mock/svelte-markdown-mock',
    techStack: ['Svelte', 'JavaScript', 'CSS', 'Rollup'],
  },
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
