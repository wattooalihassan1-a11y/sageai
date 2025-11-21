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

import type { ConversationHistory, Settings, View } from '@/lib/types';

type AiResponse = {
  response?: string;
  image?: string;
  view?: View;
  data?: any;
  error?: string;
}

export async function getAiResponse(
  history: ConversationHistory[],
  userInput: string,
  settings: Settings,
  image?: string
): Promise<AiResponse> {
  try {
    if (userInput.startsWith('/imagine ')) {
      const prompt = userInput.replace('/imagine ', '');
      const input: GeneratePictureInput = { prompt };
      const result = await generatePicture(input);
      return { image: result.imageUrl };
    }
    
    if (userInput.startsWith('/analyze ')) {
      const problem = userInput.replace('/analyze ', '');
      const { analysis, error } = await getProblemAnalysis(problem);
      if (error) return { error };
      return { 
        view: 'Analyze', 
        data: { input: problem, result: analysis }, 
        response: `I've analyzed the problem. Switching to the 'Analyze' view to show you the results.` 
      };
    }

    if (userInput.startsWith('/explain ')) {
        const topic = userInput.replace('/explain ', '');
        const { explanation, error } = await getTopicExplanation(topic);
        if (error) return { error };
        return { 
            view: 'Explain', 
            data: { input: topic, result: explanation },
            response: `I've prepared an explanation for you. Switching to the 'Explain' view.`
        };
    }

    if (userInput.startsWith('/summarize ')) {
        const text = userInput.replace('/summarize ', '');
        const { summary, error } = await getSummary(text);
        if (error) return { error };
        return { 
            view: 'Summarize',
            data: { input: text, result: summary },
            response: `I've summarized the text. You can see the result in the 'Summarize' view.`
        };
    }

    if (userInput.startsWith('/idea ')) {
        const topic = userInput.replace('/idea ', '');
        const { ideas, error } = await getIdeaAction(topic);
        if (error) return { error };
        return {
            view: 'Get Idea',
            data: { input: topic, result: ideas },
            response: `Here are some ideas! I'm switching to the 'Get Idea' view for you.`
        };
    }


    const recentHistory = history.slice(-5);

    const input: MaintainConversationContextInput = {
      userInput: userInput,
      conversationHistory: recentHistory,
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

export async function getProblemAnalysis(
  problem: string
): Promise<{ analysis?: AnalyzeProblemOutput; error?: string }> {
  try {
    const input: AnalyzeProblemInput = { problem };
    const analysis = await analyzeProblem(input);
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
    const explanation = await explainTopic(input);
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
    const summary = await summarizeText(input);
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
    const ideas = await getIdea(input);
    return { ideas };
  } catch (error: any) {
    console.error('Error getting ideas:', error);
    return { error: 'Sorry, I encountered an error while generating ideas. Please try again.' };
  }
}
