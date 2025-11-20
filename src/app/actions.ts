'use server';

import {
  generatePicture,
  type GeneratePictureInput,
} from '@/ai/flows/generate-picture';
import {
  maintainConversationContext,
  type MaintainConversationContextInput,
} from '@/ai/flows/maintain-conversation-context';
import type { ConversationHistory, Settings } from '@/lib/types';

export async function getAiResponse(
  history: ConversationHistory[],
  userInput: string,
  settings: Settings,
  image?: string
) {
  try {
    if (userInput.startsWith('/imagine ')) {
      const prompt = userInput.replace('/imagine ', '');
      const input: GeneratePictureInput = { prompt };
      const result = await generatePicture(input);
      return { image: result.imageUrl };
    }

    const input: MaintainConversationContextInput = {
      userInput: userInput,
      conversationHistory: history,
      persona: settings.persona,
      language: settings.language,
      image,
    };
    const result = await maintainConversationContext(input);
    return { response: result.response };
  } catch (error: any) {
    console.error('Error getting AI response:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}
