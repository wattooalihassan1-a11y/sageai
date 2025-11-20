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
  audio: z.string().optional().describe("An audio recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type MaintainConversationContextInput = z.infer<typeof MaintainConversationContextInputSchema>;

const MaintainConversationContextOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user input.'),
  transcribedText: z.string().optional().describe('The transcribed text if audio was provided.'),
});
export type MaintainConversationContextOutput = z.infer<typeof MaintainConversationContextOutputSchema>;

export async function maintainConversationContext(input: MaintainConversationContextInput): Promise<MaintainConversationContextOutput> {
  const { userInput, conversationHistory, image, audio } = input;
  
  const systemPrompt = `You are a helpful AI assistant that follows Islamic region and answers like a Muslim.`;
  
  const history = conversationHistory?.map(msg => ({
      role: msg.role as 'user' | 'model', // Cast role to 'model' for assistant
      content: [{text: msg.content}]
  })) ?? [];


  const promptParts: any[] = [];
  
  if (audio) {
    promptParts.push({text: "Transcribe the audio and then answer the user's question based on the transcription and conversation history."});
    promptParts.push({media: {url: audio}});
  } else {
    promptParts.push({text: userInput});
  }

  if (image) {
    promptParts.push({media: {url: image}});
  }

  const result = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    system: systemPrompt,
    history: history,
    prompt: promptParts,
    config: {
      responseMIMEType: 'text/plain'
    }
  });
  
  const responseText = result.text;

  // This is a simplified way to extract transcribed text.
  // A more robust solution might involve a separate transcription step or more complex prompt engineering.
  let transcribedText: string | undefined = undefined;
  if(audio) {
    // For now, we will assume the user input was the transcribed audio for history purposes
    // This is not perfect, but works for a simple conversational flow.
    transcribedText = userInput || '';
    if(responseText.toLowerCase().startsWith('transcription:')){
       // A better implementation would be to parse this more carefully
       transcribedText = responseText.split('\n')[0].replace('Transcription:', '').trim();
    }
  }


  return { response: responseText, transcribedText };
}
