'use server';
/**
 * @fileOverview AI flow that generates ideas based on a topic.
 *
 * - getIdea - A function that generates ideas.
 * - GetIdeaInput - The input type for the getIdea function.
 * - GetIdeaOutput - The return type for the getIdea function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetIdeaInputSchema = z.object({
  topic: z.string().describe('The topic to generate ideas for.'),
});
export type GetIdeaInput = z.infer<typeof GetIdeaInputSchema>;

const GetIdeaOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of creative ideas related to the topic.'),
});
export type GetIdeaOutput = z.infer<typeof GetIdeaOutputSchema>;


const prompt = ai.definePrompt({
  name: 'getIdeaPrompt',
  input: { schema: GetIdeaInputSchema },
  output: { schema: GetIdeaOutputSchema },
  prompt: `You are a creative brainstorming partner. A user wants ideas for the following topic.
Generate a list of unique and interesting ideas.

Topic:
{{{topic}}}
`,
});

export const getIdea = ai.defineFlow(
  {
    name: 'getIdeaFlow',
    inputSchema: GetIdeaInputSchema,
    outputSchema: GetIdeaOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
