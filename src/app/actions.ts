'use server';

import {
  maintainConversationContext,
  type MaintainConversationContextInput,
} from '@/ai/flows/maintain-conversation-context';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { ConversationHistory } from '@/lib/types';

export async function getAiResponse(
  history: ConversationHistory[],
  userInput: string,
  image?: string,
  audio?: string
) {
  try {
    const input: MaintainConversationContextInput = {
      userInput: userInput,
      conversationHistory: history,
      image,
      audio,
    };
    const result = await maintainConversationContext(input);
    return { response: result.response, transcribedText: result.transcribedText };
  } catch (error: any) {
    console.error('Error getting AI response:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}


export async function getAudioResponse(text: string) {
    try {
        const result = await textToSpeech({ text });
        return { audio: result.audio };
    } catch (error) {
        console.error('Error getting audio response:', error);
        return { error: 'Sorry, I could not generate audio.' };
    }
}
