'use server';
/**
 * @fileOverview AI flow that explains a topic.
 *
 * - explainTopic - A function that explains a topic.
 * - ExplainTopicInput - The input type for the explainTopic function.
 * - ExplainTopicOutput - The return type for the explainTopic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainTopicInputSchema = z.object({
  topic: z.string().describe('The topic to explain.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the topic.'),
  examples: z.array(z.string()).describe('Simple examples to illustrate the topic.'),
  analogy: z.string().describe('An easy-to-understand analogy.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;


const prompt = ai.definePrompt({
  name: 'explainTopicPrompt',
  input: { schema: ExplainTopicInputSchema },
  output: { schema: ExplainTopicOutputSchema },
  prompt: `You are an expert educator who can explain complex topics in a simple and understandable way.
A user wants to understand the following topic. Provide a clear explanation, a few simple examples, and a relatable analogy.

Topic:
{{{topic}}}
`,
});

export const explainTopic = ai.defineFlow(
  {
    name: 'explainTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
