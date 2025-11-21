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
import type { Flow } from 'genkit';

// Helper to run flows on Vercel. It uses fetch to call the API route.
async function runFlowOnVercel<I, O>(flow: Flow<I, O>, input: I): Promise<O> {
  const flowName = flow.name;
  const apiUrl = process.env.VERCEL_URL
    ? `https://` + process.env.VERCEL_URL + `/api/genkit/flow/${flowName}`
    : `http://localhost:3000/api/genkit/flow/${flowName}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flow execution failed: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  return result.output;
}

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
      const result = await runFlowOnVercel(generatePicture, input);
      return { image: result.imageUrl };
    }

    const input: MaintainConversationContextInput = {
      userInput: userInput,
      conversationHistory: history,
      persona: settings.persona,
      language: settings.language,
      image,
    };
    const result = await runFlowOnVercel(maintainConversationContext, input);
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
    const analysis = await runFlowOnVercel(analyzeProblem, input);
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
    const explanation = await runFlowOnVercel(explainTopic, input);
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
    const summary = await runFlowOnVercel(summarizeText, input);
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
    const ideas = await runFlowOnVercel(getIdea, input);
    return { ideas };
  } catch (error: any) {
    console.error('Error getting ideas:', error);
    return { error: 'Sorry, I encountered an error while generating ideas. Please try again.' };
  }
}
