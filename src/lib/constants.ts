
import type { Project, Creator, Category, ProjectChallenge } from '@/types';

export const CATEGORIES: Category[] = ['Web App', 'Mobile App', 'UI/UX Design', 'Code Snippet', 'Open Source Project'];

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'dev1',
    name: 'Alice Wonderland',
    photoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'female developer',
    location: 'Silicon Valley, CA',
    bio: 'Full-stack developer with a passion for creating intuitive web applications. Loves Next.js and serverless architectures.',
    statement: 'Code is my canvas. I strive to build software that is not only functional but also a joy to use.',
    githubUsername: 'alicew',
    personalWebsite: 'https://alicew.dev',
  },
  {
    id: 'des2',
    name: 'Bob Byte',
    photoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'male designer',
    location: 'Austin, TX',
    bio: 'UI/UX designer focused on human-centered design. Expert in Figma and creating delightful user experiences for mobile apps.',
    statement: 'Design is about solving problems elegantly. My goal is to make technology accessible and beautiful for everyone.',
    githubUsername: 'bobbyte',
    linkedInProfile: 'https://linkedin.com/in/bobbyte',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj101',
    title: 'Ecoleta - Recycling Finder',
    description: 'A web application helping users find nearby recycling points for various materials. Built with Next.js, TypeScript, and Mapbox.',
    tags: ['web app', 'nextjs', 'typescript', 'sustainability', 'maps'],
    previewImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'app map',
    category: 'Web App',
    creatorId: 'dev1',
    creatorName: 'Alice Wonderland',
    uploadDate: new Date(2023, 8, 15).toISOString(),
    isFeatured: true,
    projectUrl: 'https://github.com/alicew/ecoleta',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase'],
  },
  {
    id: 'proj102',
    title: 'Zenith Mobile Banking UI Kit',
    description: 'A comprehensive UI kit for a modern mobile banking application, designed in Figma. Includes 50+ screens and components.',
    tags: ['ui kit', 'figma', 'mobile app', 'fintech', 'design system'],
    previewImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'mobile design',
    category: 'UI/UX Design',
    creatorId: 'des2',
    creatorName: 'Bob Byte',
    uploadDate: new Date(2023, 9, 20).toISOString(),
    projectUrl: 'https://figma.com/community/file/12345/zenith-banking-ui-kit',
    techStack: ['Figma', 'Material Design'],
  },
  {
    id: 'proj103',
    title: 'Python Web Scraper for News',
    description: 'A Python script that scrapes headlines from various news websites using BeautifulSoup and Requests.',
    tags: ['python', 'web scraping', 'automation', 'script', 'data'],
    previewImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'code editor',
    category: 'Code Snippet',
    creatorId: 'dev1',
    creatorName: 'Alice Wonderland',
    uploadDate: new Date(2023, 10, 1).toISOString(),
    projectUrl: 'https://gist.github.com/alicew/abc123xyz',
    techStack: ['Python', 'BeautifulSoup', 'Requests'],
  },
  {
    id: 'proj104',
    title: 'My Awesome App',
    description: 'An innovative mobile application for task management, built with React Native and Firebase.',
    tags: ['mobile app', 'react native', 'firebase', 'productivity'],
    previewImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'mobile interface',
    category: 'Mobile App',
    creatorId: 'des2', // Let's say Bob also codes
    creatorName: 'Bob Byte',
    uploadDate: new Date(2023, 11, 10).toISOString(),
    isFeatured: true,
    projectUrl: 'https://github.com/bobbyte/awesome-task-app',
    techStack: ['React Native', 'Firebase', 'Expo'],
  },
  {
    id: 'proj105',
    title: 'Markdown Editor Library',
    description: 'A lightweight, embeddable Markdown editor component built with Svelte. Open source and community-driven.',
    tags: ['open source', 'javascript', 'markdown', 'library', 'svelte'],
    previewImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'web interface',
    category: 'Open Source Project',
    creatorId: 'dev1',
    creatorName: 'Alice Wonderland',
    uploadDate: new Date(2024, 0, 5).toISOString(),
    projectUrl: 'https://github.com/alicew/markdown-svelte-editor',
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
