'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Lightbulb,
  Combine,
  MessageSquareQuote,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const tabs = [
  { name: 'Generate', icon: Sparkles },
  { name: 'Improve', icon: Lightbulb },
  { name: 'Convert', icon: Combine },
  { name: 'Explain', icon: MessageSquareQuote },
];

export function CodeForge() {
  const [activeTab, setActiveTab] = useState('Generate');

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

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {activeTab === 'Generate' && <GenerateCode />}
        {activeTab === 'Improve' && <ComingSoon name="Improve" />}
        {activeTab === 'Convert' && <ComingSoon name="Convert" />}
        {activeTab === 'Explain' && <ComingSoon name="Explain" />}
      </div>
    </div>
  );
}

function GenerateCode() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Generate Code</h2>
      </div>
      <p className="text-muted-foreground">
        Describe the feature or function you want, and let the AI bring it to life in your chosen language.
      </p>

      <div className="grid w-full gap-2">
        <Label htmlFor="code-description" className="font-semibold">Code Description</Label>
        <Textarea
          id="code-description"
          placeholder="e.g., A Python function that takes a list of integers and returns the sum of all even numbers."
          className="min-h-[120px] bg-background"
          rows={5}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor="language" className="font-semibold">Programming Language</Label>
        <Select defaultValue="typescript">
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="go">Go</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button className="mt-4 w-full sm:w-auto self-start">Generate</Button>
    </div>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center h-60">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Terminal className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold">{name} is coming soon!</h3>
      <p className="text-muted-foreground">This feature is under development. Please check back later.</p>
    </div>
  )
}
