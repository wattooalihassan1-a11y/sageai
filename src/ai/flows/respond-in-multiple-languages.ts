'use server';

/**
 * @fileOverview A multi-language AI agent.
 *
 * - respondInLanguage - A function that responds to the user in their specified language.
 * - RespondInLanguageInput - The input type for the respondInLanguage function.
 * - RespondInLanguageOutput - The return type for the respondInLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RespondInLanguageInputSchema = z.object({    
  userQuery: z.string().describe('The query from the user.'),
  language: z.string().describe('The language in which the AI should respond.'),
});

export type RespondInLanguageInput = z.infer<typeof RespondInLanguageInputSchema>;

const RespondInLanguageOutputSchema = z.object({
  response: z.string().describe('The response from the AI in the specified language.'),
});

export type RespondInLanguageOutput = z.infer<typeof RespondInLanguageOutputSchema>;

export async function respondInLanguage(input: RespondInLanguageInput): Promise<RespondInLanguageOutput> {
  return respondInLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'respondInLanguagePrompt',
  input: {schema: RespondInLanguageInputSchema},
  output: {schema: RespondInLanguageOutputSchema},
  prompt: `You are a multilingual AI assistant. The user will provide a query and a desired language.
You must respond to the query in the specified language.

User Query: {{{userQuery}}}

Language: {{{language}}}

Response:`,
});

const respondInLanguageFlow = ai.defineFlow(
  {
    name: 'respondInLanguageFlow',
    inputSchema: RespondInLanguageInputSchema,
    outputSchema: RespondInLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
