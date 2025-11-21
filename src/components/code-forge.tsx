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
import { cn } from '@/lib/utils';

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
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {capabilities.map((capability) => (
          <Button
            key={capability.name}
            variant={activeCapability.name === capability.name ? 'default' : 'outline'}
            className={cn(
              "flex flex-col items-center justify-center h-16 w-full p-2 gap-1",
              "text-xs font-semibold leading-tight text-center"
            )}
            onClick={() => setActiveCapability(capability)}
          >
            <capability.icon className="h-4 w-4 mb-1" />
            <span>{capability.name}</span>
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[600px]">
        {activeCapability.component}
      </div>
    </div>
  );
}
