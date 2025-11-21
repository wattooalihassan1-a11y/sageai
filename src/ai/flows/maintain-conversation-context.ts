'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MaintainConversationContextInputSchema = z.object({
  userInput: z.string().describe('The latest user input in the conversation.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The history of the conversation so far.'),
  persona: z.string().optional().describe('The persona the AI should adopt.'),
  language: z.string().optional().describe('The language the AI should respond in.'),
  image: z.string().optional().describe("A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type MaintainConversationContextInput = z.infer<typeof MaintainConversationContextInputSchema>;

const MaintainConversationContextOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user input.'),
});
export type MaintainConversationContextOutput = z.infer<typeof MaintainConversationContextOutputSchema>;


export const maintainConversationContext = ai.defineFlow(
  {
    name: 'maintainConversationContextFlow',
    inputSchema: MaintainConversationContextInputSchema,
    outputSchema: MaintainConversationContextOutputSchema,
  },
  async (input) => {
    const { userInput, conversationHistory, image, persona, language } = input;
    
    const systemPrompt = `You are a helpful AI assistant.
${persona ? `Please adopt the following persona: ${persona}.` : ''}
${language ? `Please respond in the following language: ${language}.` : "Respond in the same language as the user's input."}
`;
    
    const history = conversationHistory?.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: [{text: msg.content}]
    })) ?? [];
  
    const promptParts: any[] = [];
  
    if (image) {
      promptParts.push({media: {url: image}});
    }
    promptParts.push({text: userInput});
    
    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      history: history,
      prompt: promptParts,
    });
    
    const responseText = result.text;
  
    return { response: responseText };
  }
);
