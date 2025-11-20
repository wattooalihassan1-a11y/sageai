'use server';
/**
 * @fileOverview A Genkit flow for generating images from a text prompt.
 *
 * - generatePicture - A function that generates an image.
 * - GeneratePictureInput - The input type for the generatePicture function.
 * - GeneratePictureOutput - The return type for the generatePicture function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePictureInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GeneratePictureInput = z.infer<typeof GeneratePictureInputSchema>;

const GeneratePictureOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image as a data URI.'),
});
export type GeneratePictureOutput = z.infer<typeof GeneratePictureOutputSchema>;

export async function generatePicture(input: GeneratePictureInput): Promise<GeneratePictureOutput> {
  return generatePictureFlow(input);
}

const generatePictureFlow = ai.defineFlow(
  {
    name: 'generatePictureFlow',
    inputSchema: GeneratePictureInputSchema,
    outputSchema: GeneratePictureOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
