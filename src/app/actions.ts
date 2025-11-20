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

    if (language && language.toLowerCase() !== 'English') {
      const input: RespondInLanguageInput = {
        userQuery: fullPrompt,
        language: language,
        image,
      };
      const result = await respondInLanguage(input);
      return { response: result.response };
    } else {
      // Create a history that includes the persona instruction for the last user message.
      const historyWithPersona: ConversationHistory[] = [...history];
      if (historyWithPersona.length > 0 && historyWithPersona[historyWithPersona.length - 1].role === 'user') {
          historyWithPersona[historyWithPersona.length-1] = {
              ...historyWithPersona[historyWithPersona.length-1],
              content: `${persona ? `Your persona is: "${persona}". Respond accordingly. ` : ''}${historyWithPersona[historyWithPersona.length-1].content}`
          }
      }
      
      const input: MaintainConversationContextInput = {
        userInput: userInput,
        conversationHistory: history,
        image,
      };
      
      // We pass the original user input to the flow directly, but modify the history.
      const result = await maintainConversationContext({
          ...input,
          userInput: fullPrompt,
      });

      return { response: result.response };
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}
