'use client';

import { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  Combine,
  MessageSquareQuote,
  BrainCircuit,
  BookText,
  ListTodo,
  FileCode,
  Pencil,
  ImageIcon,
  Gift,
  Zap,
  ChevronDown,
  BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Chat } from '@/components/chat';
import { Analyze } from '@/components/analyze';
import { Explain } from '@/components/explain';
import { Summarize } from '@/components/summarize';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

const capabilities = [
  { name: 'Solve', icon: Sparkles, component: <Chat /> },
  { name: 'Analyze', icon: Lightbulb, component: <Analyze /> },
  { name: 'Explain', icon: MessageSquareQuote, component: <Explain /> },
  { name: 'Summarize Text', icon: Combine, component: <Summarize /> },
  { name: 'Get Advise', icon: BookText, component: <ComingSoon name="Get Advise" /> },
  { name: 'Make a Plan', icon: ListTodo, component: <ComingSoon name="Make a Plan" /> },
  { name: 'Analyze Data', icon: BarChart, component: <ComingSoon name="Analyze Data" /> },
  { name: 'Code', icon: FileCode, component: <ComingSoon name="Code" /> },
  { name: 'Help me Write', icon: Pencil, component: <ComingSoon name="Help me Write" /> },
  { name: 'Analyze Image', icon: ImageIcon, component: <ComingSoon name="Analyze Image" /> },
  { name: 'Surprise Me', icon: Gift, component: <ComingSoon name="Surprise Me" /> },
  { name: 'Brainstorm', icon: Zap, component: <ComingSoon name="Brainstorm" /> },
];

export function CodeForge() {
  const [activeCapability, setActiveCapability] = useState(capabilities[0]);

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 pb-2">
          {capabilities.map((capability) => (
            <Button
              key={capability.name}
              variant={activeCapability.name === capability.name ? 'default' : 'outline'}
              className="h-14 rounded-lg p-3 text-base font-semibold"
              onClick={() => setActiveCapability(capability)}
            >
              <capability.icon className="mr-2 h-5 w-5" />
              {capability.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[600px]">
        {activeCapability.component}
      </div>
    </div>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center h-full animate-fade-in-slide-up">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <BrainCircuit className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold">{name} is coming soon!</h3>
      <p className="text-muted-foreground">This feature is under development. Please check back later.</p>
    </div>
  )
}
