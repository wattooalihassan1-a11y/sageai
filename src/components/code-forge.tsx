
'use client';

import { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  Combine,
  MessageSquareQuote,
  BrainCircuit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Chat } from '@/components/chat';

const tabs = [
  { name: 'Solve', icon: Sparkles },
  { name: 'Analyze', icon: Lightbulb },
  { name: 'Simplify', icon: Combine },
  { name: 'Explain', icon: MessageSquareQuote },
];

export function CodeForge() {
  const [activeTab, setActiveTab] = useState('Solve');

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            variant={activeTab === tab.name ? 'secondary' : 'ghost'}
            className={cn(
              'h-14 justify-start gap-3 rounded-lg p-3 text-base font-semibold',
              activeTab === tab.name && 'bg-primary/10 text-primary'
            )}
            onClick={() => setActiveTab(tab.name)}
          >
            <tab.icon className="h-5 w-5" />
            {tab.name}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[600px]">
        {activeTab === 'Solve' && <Chat />}
        {activeTab === 'Analyze' && <ComingSoon name="Analyze" />}
        {activeTab === 'Simplify' && <ComingSoon name="Simplify" />}
        {activeTab === 'Explain' && <ComingSoon name="Explain" />}
      </div>
    </div>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center h-full">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <BrainCircuit className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold">{name} is coming soon!</h3>
      <p className="text-muted-foreground">This feature is under development. Please check back later.</p>
    </div>
  )
}
