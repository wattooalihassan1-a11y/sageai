'use server';

import {
  generatePicture,
  type GeneratePictureInput,
} from '@/ai/flows/generate-picture';
import {
  maintainConversationContext,
  type MaintainConversationContextInput,
} from '@/ai/flows/maintain-conversation-context';
import {
  analyzeProblem,
  type AnalyzeProblemInput,
  type AnalyzeProblemOutput,
} from '@/ai/flows/analyze-problem';
import {
  explainTopic,
  type ExplainTopicInput,
  type ExplainTopicOutput,
} from '@/ai/flows/explain-topic';
import {
  summarizeText,
  type SummarizeTextInput,
  type SummarizeTextOutput,
} from '@/ai/flows/summarize-text';
import {
  getIdea,
  type GetIdeaInput,
  type GetIdeaOutput,
} from '@/ai/flows/get-idea';

import type { ConversationHistory, Settings } from '@/lib/types';
import { runFlow } from '@genkit-ai/next';

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
      const result = await runFlow(generatePicture, input);
      return { image: result.imageUrl };
    }

    const input: MaintainConversationContextInput = {
      userInput: userInput,
      conversationHistory: history,
      persona: settings.persona,
      language: settings.language,
      image,
    };
    const result = await runFlow(maintainConversationContext, input);
    return { response: result.response };
  } catch (error: any) {
    console.error('Error getting AI response:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}

export async function getProblemAnalysis(
  problem: string
): Promise<{ analysis?: AnalyzeProblemOutput; error?: string }> {
  try {
    const input: AnalyzeProblemInput = { problem };
    const analysis = await runFlow(analyzeProblem, input);
    return { analysis };
  } catch (error: any) {
    console.error('Error analyzing problem:', error);
    return { error: 'Sorry, I encountered an error during analysis. Please try again.' };
  }
}

export async function getTopicExplanation(
  topic: string
): Promise<{ explanation?: ExplainTopicOutput; error?: string }> {
  try {
    const input: ExplainTopicInput = { topic };
    const explanation = await runFlow(explainTopic, input);
    return { explanation };
  } catch (error: any) {
    console.error('Error getting explanation:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}

export async function getSummary(
  text: string
): Promise<{ summary?: SummarizeTextOutput; error?: string }> {
  try {
    const input: SummarizeTextInput = { text };
    const summary = await runFlow(summarizeText, input);
    return { summary };
  } catch (error: any) {
    console.error('Error getting summary:', error);
    return { error: 'Sorry, I encountered an error during summarization. Please try again.' };
  }
}

export async function getIdeaAction(
  topic: string
): Promise<{ ideas?: GetIdeaOutput; error?: string }> {
  try {
    const input: GetIdeaInput = { topic };
    const ideas = await runFlow(getIdea, input);
    return { ideas };
  } catch (error: any) {
    console.error('Error getting ideas:', error);
    return { error: 'Sorry, I encountered an error while generating ideas. Please try again.' };
  }
}
