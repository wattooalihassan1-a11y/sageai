'use server';

import {
  maintainConversationContext,
  type MaintainConversationContextInput,
} from '@/ai/flows/maintain-conversation-context';
import type { ConversationHistory } from '@/lib/types';

export async function getAiResponse(
  history: ConversationHistory[],
  userInput: string,
  image?: string
) {
  try {
    const input: MaintainConversationContextInput = {
      userInput: userInput,
      conversationHistory: history,
      image,
    };
    const result = await maintainConversationContext(input);
    return { response: result.response };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}
