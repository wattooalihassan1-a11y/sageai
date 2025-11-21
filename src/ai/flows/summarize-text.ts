'use server';
/**
 * @fileOverview AI flow that summarizes a given text.
 *
 * - summarizeText - A function that summarizes a text.
 * - SummarizeTextInput - The input type for the summarizeText function.
 * - SummarizeTextOutput - The return type for the summarizeText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeTextInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided text.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;


const prompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: { schema: SummarizeTextInputSchema },
  output: { schema: SummarizeTextOutputSchema },
  prompt: `You are an expert at summarizing text. Please provide a concise summary of the following content.

Text to summarize:
{{{text}}}
`,
});

export const summarizeText = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
