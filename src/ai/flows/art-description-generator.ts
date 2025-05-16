'use server';

/**
 * @fileOverview AI-powered art description and tag generator for accessibility and search.
 *
 * - generateArtDescription - Generates descriptions and tags for artwork.
 * - ArtDescriptionInput - Input type for the generateArtDescription function.
 * - ArtDescriptionOutput - Return type for the generateArtDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ArtDescriptionInput = z.infer<typeof ArtDescriptionInputSchema>;

const ArtDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the artwork.'),
  tags: z.array(z.string()).describe('Relevant tags for the artwork.'),
});
export type ArtDescriptionOutput = z.infer<typeof ArtDescriptionOutputSchema>;

export async function generateArtDescription(
  input: ArtDescriptionInput
): Promise<ArtDescriptionOutput> {
  return artDescriptionGeneratorFlow(input);
}

const artDescriptionPrompt = ai.definePrompt({
  name: 'artDescriptionPrompt',
  input: {schema: ArtDescriptionInputSchema},
  output: {schema: ArtDescriptionOutputSchema},
  prompt: `You are an AI art assistant that helps artists create detailed descriptions and relevant tags for their artwork.

  Analyze the provided image and generate a comprehensive description that captures the artwork's style, subject matter, colors, and overall mood.

  Also, generate a list of relevant tags that will help users find the artwork through search.

  Image: {{media url=photoDataUri}}
  Description:
  `,
});

const artDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'artDescriptionGeneratorFlow',
    inputSchema: ArtDescriptionInputSchema,
    outputSchema: ArtDescriptionOutputSchema,
  },
  async input => {
    const {output} = await artDescriptionPrompt(input);
    return output!;
  }
);
