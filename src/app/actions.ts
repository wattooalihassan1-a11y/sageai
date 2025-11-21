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
  homeworkHelper,
  type HomeworkHelperInput,
  type HomeworkHelperOutput,
} from '@/ai/flows/homework-helper';
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
import {
  textToSpeech,
  type TextToSpeechInput,
} from '@/ai/flows/text-to-speech';

import type { ConversationHistory, Settings, View } from '@/lib/types';

type AiResponse = {
  response?: string;
  image?: string;
  audio?: string;
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
    
    if (userInput.startsWith('/homework ')) {
      const question = userInput.replace('/homework ', '');
      const { result, error } = await getHomeworkHelp(question);
      if (error) return { error };
      return { 
        view: 'Homework Helper', 
        data: { input: question, result: result }, 
        response: `I've prepared a step-by-step guide for your question. Switching to the 'Homework Helper' view.` 
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

    const textResult = await maintainConversationContext(input);
    const responseText = textResult.response;

    let audioUrl: string | undefined;
    if (responseText) {
        try {
            const ttsInput: TextToSpeechInput = { text: responseText };
            const audioResult = await textToSpeech(ttsInput);
            audioUrl = audioResult.audioUrl;
        } catch (ttsError) {
            console.error('Error generating speech:', ttsError);
            // Non-fatal, we can still return the text response
        }
    }

    return { response: responseText, audio: audioUrl };
  } catch (error: any) {
    console.error('Error getting AI response:', error);
    return { error: 'Sorry, I encountered an error. Please try again.' };
  }
}

export async function getHomeworkHelp(
  question: string
): Promise<{ result?: HomeworkHelperOutput; error?: string }> {
  try {
    const input: HomeworkHelperInput = { question };
    const result = await homeworkHelper(input);
    return { result };
  } catch (error: any) {
    console.error('Error in homework helper:', error);
    return { error: 'Sorry, I encountered an error helping with your homework. Please try again.' };
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
