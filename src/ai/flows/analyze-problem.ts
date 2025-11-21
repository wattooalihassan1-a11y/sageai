'use server';
/**
 * @fileOverview AI flow that analyzes a problem description.
 *
 * - analyzeProblem - A function that analyzes a problem.
 * - AnalyzeProblemInput - The input type for the analyzeProblem function.
 * - AnalyzeProblemOutput - The return type for the analyzeProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeProblemInputSchema = z.object({
  problem: z.string().describe('A description of the problem to analyze.'),
});
export type AnalyzeProblemInput = z.infer<typeof AnalyzeProblemInputSchema>;

const AnalyzeProblemOutputSchema = z.object({
  keyComponents: z.array(z.string()).describe('The key components or variables of the problem.'),
  rootCause: z.string().describe('A brief analysis of the potential root cause of the problem.'),
  firstSteps: z.array(z.string()).describe('A few suggested first steps to start tackling the problem.'),
});
export type AnalyzeProblemOutput = z.infer<typeof AnalyzeProblemOutputSchema>;


const prompt = ai.definePrompt({
  name: 'analyzeProblemPrompt',
  input: { schema: AnalyzeProblemInputSchema },
  output: { schema: AnalyzeProblemOutputSchema },
  prompt: `You are an expert problem solver. Analyze the following problem description provided by the user. 
Break it down into its key components, identify the most likely root cause, and suggest a few concrete first steps the user could take to begin resolving it.

Problem:
{{{problem}}}
`,
});

export const analyzeProblem = ai.defineFlow(
  {
    name: 'analyzeProblemFlow',
    inputSchema: AnalyzeProblemInputSchema,
    outputSchema: AnalyzeProblemOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
