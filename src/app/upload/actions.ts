'use server';

import { generateArtDescription, type ArtDescriptionInput, type ArtDescriptionOutput } from '@/ai/flows/art-description-generator';

export async function generateArtDescriptionAction(photoDataUri: string): Promise<ArtDescriptionOutput> {
  if (!photoDataUri) {
    throw new Error('Image data URI is required.');
  }

  // Basic validation for data URI format (can be more robust)
  if (!photoDataUri.startsWith('data:image/')) {
    console.warn('Invalid data URI format received by server action.');
    // Forgivingly try to proceed, but log it. Consider stricter validation.
    // For production, you might want to throw an error here.
  }
  
  const input: ArtDescriptionInput = { photoDataUri };
  
  try {
    const result = await generateArtDescription(input);
    return result;
  } catch (error) {
    console.error('Error in generateArtDescription flow:', error);
    // Return a structured error or re-throw a custom error
    // For now, returning empty fields as a fallback
    return { description: '', tags: [] }; 
  }
}
