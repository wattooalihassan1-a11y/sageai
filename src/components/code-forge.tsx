'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BookMarked,
  Combine,
  MessageSquareQuote,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chat } from '@/components/chat';
import { HomeworkHelper, type HomeworkData } from '@/components/homework-helper';
import { Explain, type ExplainData } from '@/components/explain';
import { Summarize, type SummarizeData } from '@/components/summarize';
import { GetIdea, type IdeaData } from '@/components/get-idea';
import { cn } from '@/lib/utils';
import type { Capability, View } from '@/lib/types';


export function CodeForge() {
  const [viewData, setViewData] = useState<Record<string, any>>({});

  const capabilities: Capability[] = useMemo(() => [
    { name: 'Solve', icon: Sparkles, component: <Chat onViewChange={handleViewChange} /> },
    { name: 'Homework Helper', icon: BookMarked, component: <HomeworkHelper initialData={viewData['Homework Helper']} /> },
    { name: 'Explain', icon: MessageSquareQuote, component: <Explain initialData={viewData['Explain']} /> },
    { name: 'Summarize', icon: Combine, component: <Summarize initialData={viewData['Summarize']} /> },
    { name: 'Get Idea', icon: Brain, component: <GetIdea initialData={viewData['Get Idea']} /> },
  ], [viewData]);

  const [activeCapability, setActiveCapability] = useState<Capability>(capabilities[0]);
  
  function handleViewChange(view: View, data: any) {
    const targetView = capabilities.find(c => c.name === view);
    if (targetView) {
      setViewData(prev => ({ ...prev, [view]: data }));
      setActiveCapability(targetView);
    }
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        {capabilities.map((capability) => (
          <Button
            key={capability.name}
            variant={activeCapability.name === capability.name ? 'default' : 'outline'}
            className={cn(
              "flex flex-col items-center justify-center h-12 w-full p-1 gap-0.5",
              "text-[10px] font-semibold leading-tight text-center"
            )}
            onClick={() => setActiveCapability(capability)}
          >
            <capability.icon className="h-4 w-4" />
            <span>{capability.name}</span>
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[600px]">
        {React.cloneElement(activeCapability.component, { 
          key: activeCapability.name,
          onViewChange: handleViewChange,
          initialData: viewData[activeCapability.name]
        })}
      </div>
    </div>
  );
}
