
import type { Project, Creator, Category, ProjectChallenge } from '@/types';

export const CATEGORIES: Category[] = ['Web App', 'Mobile App', 'UI/UX Design', 'Code Snippet', 'Open Source Project'];

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'dev1',
    name: 'Zaid Naholi',
    photoUrl: '/img/creator-zaid-naholi.png',
    dataAiHint: 'male developer',
    location: 'Silicon Valley, CA',
    bio: 'Full-stack developer with a passion for creating intuitive web applications. Loves Next.js and serverless architectures.',
    statement: 'Code is my canvas. I strive to build software that is not only functional but also a joy to use.',
    githubUsername: 'zaidnaholi',
    personalWebsite: 'https://zaidnaholi.dev',
  },
  // Bob Byte removed
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj101',
    title: 'Ecoleta - Recycling Finder',
    description: 'A web application helping users find nearby recycling points for various materials. Built with Next.js, TypeScript, and Mapbox.',
    tags: ['web app', 'nextjs', 'typescript', 'sustainability', 'maps'],
    previewImageUrl: '/img/project-ecoleta-preview.png',
    dataAiHint: 'app map',
    category: 'Web App',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(2023, 8, 15).toISOString(),
    isFeatured: true,
    projectUrl: 'https://github.com/zaidnaholi/ecoleta',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase'],
  },
  // proj102 by Bob Byte removed
  {
    id: 'proj103',
    title: 'Python Web Scraper for News',
    description: 'A Python script that scrapes headlines from various news websites using BeautifulSoup and Requests.',
    tags: ['python', 'web scraping', 'automation', 'script', 'data'],
    previewImageUrl: '/img/project-python-scraper-preview.png',
    dataAiHint: 'code editor',
    category: 'Code Snippet',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(2023, 10, 1).toISOString(),
    projectUrl: 'https://gist.github.com/zaidnaholi/abc123xyz',
    techStack: ['Python', 'BeautifulSoup', 'Requests'],
  },
  // proj104 by Bob Byte removed
  {
    id: 'proj105',
    title: 'Markdown Editor Library',
    description: 'A lightweight, embeddable Markdown editor component built with Svelte. Open source and community-driven.',
    tags: ['open source', 'javascript', 'markdown', 'library', 'svelte'],
    previewImageUrl: '/img/project-markdown-editor-preview.png',
    dataAiHint: 'web interface',
    category: 'Open Source Project',
    creatorId: 'dev1',
    creatorName: 'Zaid Naholi',
    uploadDate: new Date(2024, 0, 5).toISOString(),
    projectUrl: 'https://github.com/zaidnaholi/markdown-svelte-editor',
    techStack: ['Svelte', 'JavaScript', 'CSS'],
  },
];

export const MOCK_CHALLENGES: ProjectChallenge[] = [
  {
    id: 'challengeDev1',
    title: 'Build a Portfolio Site with Next.js',
    description: 'Create a personal portfolio website using Next.js and deploy it. Showcase your skills and projects!',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  {
    id: 'challengeDes1',
    title: 'Redesign a Popular App UI',
    description: 'Choose a popular application and redesign its user interface. Focus on improving usability and aesthetics. Present your mockups.',
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
  }
];

export const getCreatorById = (id: string): Creator | undefined => MOCK_CREATORS.find(creator => creator.id === id);
export const getProjectsByCreator = (creatorId: string): Project[] => MOCK_PROJECTS.filter(project => project.creatorId === creatorId);
export const getProjectById = (id: string): Project | undefined => MOCK_PROJECTS.find(project => project.id === id);
