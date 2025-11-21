'use server';
import { getGcpAuthPlugin } from '@genkit-ai/google-cloud';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    getGcpAuthPlugin(),
  ],
  model: 'googleai/gemini-2.5-flash',
  maxOutputLength: 8192,
});
