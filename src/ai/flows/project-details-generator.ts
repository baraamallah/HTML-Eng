
'use server';

/**
 * @fileOverview AI-powered project description and tag generator.
 *
 * - generateProjectDetails - Generates descriptions and tags for projects based on a preview image.
 * - ProjectDetailsInput - Input type for the generateProjectDetails function.
 * - ProjectDetailsOutput - Return type for the generateProjectDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A preview image of the project (e.g., screenshot, UI mockup), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  // Optional: Could add project title or category here later for more context
});
export type ProjectDetailsInput = z.infer<typeof ProjectDetailsInputSchema>;

const ProjectDetailsOutputSchema = z.object({
  description: z.string().describe('A concise and informative description of the project, suitable for a README or summary.'),
  tags: z.array(z.string()).describe('Relevant keywords and technology tags for the project.'),
});
export type ProjectDetailsOutput = z.infer<typeof ProjectDetailsOutputSchema>;

export async function generateProjectDetails(
  input: ProjectDetailsInput
): Promise<ProjectDetailsOutput> {
  return projectDetailsGeneratorFlow(input);
}

const projectDetailsPrompt = ai.definePrompt({
  name: 'projectDetailsPrompt',
  input: {schema: ProjectDetailsInputSchema},
  output: {schema: ProjectDetailsOutputSchema},
  prompt: `You are an AI assistant helping developers and designers create compelling descriptions and relevant tags for their software projects, UI designs, or code snippets.

  Analyze the provided preview image. Based on the visual cues in the image, generate:
  1. A concise and informative description of the project. Highlight potential features, purpose, or technologies implied by the image. If it looks like a UI, describe its potential functionality. If it's abstract, focus on style or potential application.
  2. A list of relevant tags or keywords. Include technologies that might be associated with such a project, project types, and general themes.

  Image: {{media url=photoDataUri}}
  Description:
  Tags:
  `,
});

const projectDetailsGeneratorFlow = ai.defineFlow(
  {
    name: 'projectDetailsGeneratorFlow',
    inputSchema: ProjectDetailsInputSchema,
    outputSchema: ProjectDetailsOutputSchema,
  },
  async input => {
    const {output} = await projectDetailsPrompt(input);
    return output!;
  }
);
