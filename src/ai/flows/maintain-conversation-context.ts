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
    image: z.string().optional(),
  })).optional().describe('The history of the conversation so far.'),
  image: z.string().optional().describe("A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type MaintainConversationContextInput = z.infer<typeof MaintainConversationContextInputSchema>;

const MaintainConversationContextOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user input.'),
});
export type MaintainConversationContextOutput = z.infer<typeof MaintainConversationContextOutputSchema>;

export async function maintainConversationContext(input: MaintainConversationContextInput): Promise<MaintainConversationContextOutput> {
  const { userInput, conversationHistory, image } = input;

  let prompt = `You are a helpful AI assistant. Please respond to the following prompt:\n\nUser: ${userInput}`;

  if (conversationHistory && conversationHistory.length > 0) {
    const historyText = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    prompt = `You are a helpful AI assistant. Continue the conversation based on the history.\n\n${historyText}\nUser: ${userInput}`;
  }
  
  const promptParts = [{ text: prompt }];
  if (image) {
    promptParts.push({ media: { url: image } });
  }

  const result = await ai.generate({
    prompt: promptParts as any, // Cast to any to handle prompt structure
  });

  return { response: result.text };
}
