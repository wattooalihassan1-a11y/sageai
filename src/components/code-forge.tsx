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

const capabilities = [
  { name: 'Solve', icon: Sparkles, component: <Chat /> },
  { name: 'Analyze', icon: Lightbulb, component: <Analyze /> },
  { name: 'Explain', icon: MessageSquareQuote, component: <Explain /> },
  { name: 'Get Advise', icon: BookText, component: <ComingSoon name="Get Advise" /> },
  { name: 'Summarize Text', icon: Combine, component: <ComingSoon name="Summarize Text" /> },
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-14 justify-between rounded-lg p-3 text-base font-semibold"
          >
            <div className="flex items-center gap-3">
              <activeCapability.icon className="h-5 w-5 text-primary" />
              {activeCapability.name}
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
          {capabilities.map((capability) => (
            <DropdownMenuItem
              key={capability.name}
              className={cn(
                'h-12 justify-start gap-3 rounded-lg p-3 text-base font-semibold',
                activeCapability.name === capability.name && 'bg-primary/10 text-primary'
              )}
              onClick={() => setActiveCapability(capability)}
            >
              <capability.icon className="h-5 w-5" />
              {capability.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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
