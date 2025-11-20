'use server';

import {
  maintainConversationContext,
  type MaintainConversationContextInput,
} from '@/ai/flows/maintain-conversation-context';
import {
  respondInLanguage,
  type RespondInLanguageInput,
} from '@/ai/flows/respond-in-multiple-languages';
import type { ConversationHistory } from '@/lib/types';

export async function getAiResponse(
  history: ConversationHistory[],
  userInput: string,
  language: string,
  persona: string,
  image?: string
) {
  try {
    const fullPrompt = `${persona ? `Your persona is: "${persona}". Respond accordingly. ` : ''}${userInput}`;

    if (language && language.toLowerCase() !== 'en' && language.toLowerCase() !== 'english') {
      const input: RespondInLanguageInput = {
        userQuery: fullPrompt,
        language: language,
        image,
      };
      const result = await respondInLanguage(input);
      return { response: result.response };
    } else {
      const input: MaintainConversationContextInput = {
        userInput: fullPrompt,
        conversationHistory: history,
        image,
      };
      const result = await maintainConversationContext(input);
      return { response: result.response };
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}
