'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-response.ts';
import '@/ai/flows/maintain-conversation-context.ts';
import '@/ai/flows/respond-in-multiple-languages.ts';
import '@/ai/flows/generate-picture.ts';
import '@/ai/flows/homework-helper.ts';
import '@/ai/flows/explain-topic.ts';
import '@/ai/flows/summarize-text.ts';
import '@/ai/flows/get-idea.ts';
import '@/ai/flows/text-to-speech.ts';
