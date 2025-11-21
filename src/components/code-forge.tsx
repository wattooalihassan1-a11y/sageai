'use client';

import { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  Combine,
  MessageSquareQuote,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chat } from '@/components/chat';
import { Analyze } from '@/components/analyze';
import { Explain } from '@/components/explain';
import { Summarize } from '@/components/summarize';
import { GetIdea } from '@/components/get-idea';
import { ScrollArea } from '@/components/ui/scroll-area';

const capabilities = [
  { name: 'Solve', icon: Sparkles, component: <Chat /> },
  { name: 'Analyze', icon: Lightbulb, component: <Analyze /> },
  { name: 'Explain', icon: MessageSquareQuote, component: <Explain /> },
  { name: 'Summarize', icon: Combine, component: <Summarize /> },
  { name: 'Get Idea', icon: Brain, component: <GetIdea /> },
];

export function CodeForge() {
  const [activeCapability, setActiveCapability] = useState(capabilities[0]);

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex w-max space-x-2 pb-2">
            {capabilities.map((capability) => (
              <Button
                key={capability.name}
                variant={activeCapability.name === capability.name ? 'default' : 'outline'}
                className="h-12 rounded-lg px-4 py-2 text-sm font-semibold"
                onClick={() => setActiveCapability(capability)}
              >
                <capability.icon className="mr-2 h-5 w-5" />
                {capability.name}
              </Button>
            ))}
        </div>
      </ScrollArea>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[600px]">
        {activeCapability.component}
      </div>
    </div>
  );
}
