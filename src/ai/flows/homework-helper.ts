'use server';
/**
 * @fileOverview AI flow that helps students with homework questions.
 *
 * - homeworkHelper - A function that provides a step-by-step solution.
 * - HomeworkHelperInput - The input type for the homeworkHelper function.
 * - HomeworkHelperOutput - The return type for the homeworkHelper function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HomeworkHelperInputSchema = z.object({
  question: z.string().describe('The homework question from the student.'),
});
export type HomeworkHelperInput = z.infer<typeof HomeworkHelperInputSchema>;

const HomeworkHelperOutputSchema = z.object({
  steps: z.array(z.object({
    title: z.string().describe('The title of the step.'),
    explanation: z.string().describe('The detailed explanation for this step.'),
  })).describe('A list of steps to solve the problem.'),
  finalAnswer: z.string().describe('The final, conclusive answer to the question.'),
});
export type HomeworkHelperOutput = z.infer<typeof HomeworkHelperOutputSchema>;


const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: { schema: HomeworkHelperInputSchema },
  output: { schema: HomeworkHelperOutputSchema },
  prompt: `You are a friendly and encouraging tutor AI. A student has asked for help with a homework question.
Your goal is to guide them to the answer, not just provide it.
Break down the solution into logical, easy-to-follow steps. For each step, provide a clear title and a simple explanation.
Finally, provide the final answer.

Student's Question:
{{question}}
`,
});

export const homeworkHelper = ai.defineFlow(
  {
    name: 'homeworkHelperFlow',
    inputSchema: HomeworkHelperInputSchema,
    outputSchema: HomeworkHelperOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
