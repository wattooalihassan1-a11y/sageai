'use server';

/**
 * @fileOverview Implements a Genkit flow to maintain conversation context across multiple turns.
 *
 * - `maintainConversationContext` - The main function to initiate the flow with user input.
 * - `MaintainConversationContextInput` - The input type for the `maintainConversationContext` function.
 * - `MaintainConversationContextOutput` - The output type for the `maintainConversationContext` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaintainConversationContextInputSchema = z.object({
  userInput: z.string().describe('The latest user input in the conversation.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The history of the conversation so far.'),
});
export type MaintainConversationContextInput = z.infer<typeof MaintainConversationContextInputSchema>;

const MaintainConversationContextOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user input.'),
});
export type MaintainConversationContextOutput = z.infer<typeof MaintainConversationContextOutputSchema>;

export async function maintainConversationContext(input: MaintainConversationContextInput): Promise<MaintainConversationContextOutput> {
  return maintainConversationContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'maintainConversationContextPrompt',
  input: {schema: MaintainConversationContextInputSchema},
  output: {schema: MaintainConversationContextOutputSchema},
  prompt: `You are a helpful AI assistant. Respond to the user input while maintaining context from the conversation history.

{% if conversationHistory %}
Conversation History:
  {% each conversationHistory %}
    {{this.role}}: {{this.content}}
  {% endeach %}
{% endif %}

User Input: {{userInput}}

Assistant: `,
});

const maintainConversationContextFlow = ai.defineFlow(
  {
    name: 'maintainConversationContextFlow',
    inputSchema: MaintainConversationContextInputSchema,
    outputSchema: MaintainConversationContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
