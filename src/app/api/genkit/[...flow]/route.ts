'use server';
import { getGcpAuthPlugin } from '@genkit-ai/google-cloud';
import { nextHandler } from '@genkit-ai/next';
import { googleAI } from '@genkit-ai/google-genai';

import '@/ai/flows/generate-response';
import '@/ai/flows/maintain-conversation-context';
import '@/ai/flows/respond-in-multiple-languages';
import '@/ai/flows/generate-picture';
import '@/ai/flows/analyze-problem';
import '@/ai/flows/explain-topic';
import '@/ai/flows/summarize-text';
import '@/ai/flows/get-idea';

export const POST = nextHandler({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    getGcpAuthPlugin(),
  ],
  maxOutputLength: 8192,
});
