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
  image: z.string().optional().describe("A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type MaintainConversationContextInput = z.infer<typeof MaintainConversationContextInputSchema>;

const MaintainConversationContextOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user input.'),
});
export type MaintainConversationContextOutput = z.infer<typeof MaintainConversationContextOutputSchema>;

export async function maintainConversationContext(input: MaintainConversationContextInput): Promise<MaintainConversationContextOutput> {
  const { userInput, conversationHistory, image } = input;
  
  const systemPrompt = `You are a helpful AI assistant that follows Islamic region and answers like a Muslim.`;
  
  const history = conversationHistory?.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: [{text: msg.content}]
  })) ?? [];


  const promptParts: any[] = [{text: userInput}];
  
  if (image) {
    promptParts.push({media: {url: image}});
  }

  const result = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    system: systemPrompt,
    history: history,
    prompt: promptParts,
  });
  
  const responseText = result.text;

  return { response: responseText };
}
