
'use server';

import { generateProjectDetails, type ProjectDetailsInput, type ProjectDetailsOutput } from '@/ai/flows/project-details-generator'; // Renamed imports

export async function generateProjectDetailsAction(photoDataUri: string): Promise<ProjectDetailsOutput> { // Renamed action and types
  if (!photoDataUri) {
    throw new Error('Preview image data URI is required.');
  }

  if (!photoDataUri.startsWith('data:image/')) {
    console.warn('Invalid data URI format received by server action.');
    // Consider stricter validation for production
  }
  
  const input: ProjectDetailsInput = { photoDataUri };
  
  try {
    const result = await generateProjectDetails(input); // Called renamed flow
    return result;
  } catch (error) {
    console.error('Error in generateProjectDetails flow:', error);
    return { description: '', tags: [] }; 
  }
}
