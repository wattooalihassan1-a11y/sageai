'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, AlertTriangle, Wand } from 'lucide-react';
import { getIdeaAction } from '@/app/actions';
import type { GetIdeaOutput } from '@/ai/flows/get-idea';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';

export function GetIdea() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<GetIdeaOutput | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetIdea = async () => {
    if (!topic.trim()) return;
    setIsPending(true);
    setError(null);
    setResult(null);

    const response = await getIdeaAction(topic);

    if (response.error) {
      setError(response.error);
    } else if (response.ideas) {
      setResult(response.ideas);
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Get Ideas</h2>
      </div>
      
      <div className="flex-1 space-y-6">
        <p className="text-muted-foreground">
          Enter a topic or a brief, and the AI will generate a list of creative ideas for you.
        </p>
        
        <div className="flex items-center gap-2">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., A new mobile app for productivity"
              className="bg-background"
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGetIdea();
              }}
            />
            <Button onClick={handleGetIdea} disabled={!topic.trim() || isPending}>
              <Wand className="mr-2" />
              Get Ideas
            </Button>
        </div>

        {isPending && <IdeaSkeleton />}
        {error && <IdeaError message={error} />}
        {result && <IdeaResult result={result} />}

      </div>
    </div>
  );
}

function IdeaResult({ result }: { result: GetIdeaOutput }) {
    return (
        <Card className="animate-fade-in-slide-up">
            <CardContent className="pt-6 space-y-3">
                 <ul className="list-disc list-inside pl-4 space-y-2 text-muted-foreground">
                    {result.ideas.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </CardContent>
        </Card>
    )
}

function IdeaSkeleton() {
    return (
        <Card>
            <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/5" />
            </CardContent>
        </Card>
    )
}

function IdeaError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive animate-fade-in-slide-up">
            <AlertTriangle />
            <p>{message}</p>
        </div>
    )
}
