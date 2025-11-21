'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Combine, FileText, AlertTriangle, Wand } from 'lucide-react';
import { getSummary } from '@/app/actions';
import type { SummarizeTextOutput } from '@/ai/flows/summarize-text';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';

export function Summarize() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SummarizeTextOutput | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsPending(true);
    setError(null);
    setResult(null);

    const response = await getSummary(text);

    if (response.error) {
      setError(response.error);
    } else if (response.summary) {
      setResult(response.summary);
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Combine className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Summarize Text</h2>
      </div>
      
      <div className="flex-1 space-y-6">
        <p className="text-muted-foreground">
          Paste a long piece of text below, and the AI will generate a concise summary for you.
        </p>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="min-h-[150px] bg-background"
          rows={6}
          disabled={isPending}
        />

        <Button onClick={handleSummarize} disabled={!text.trim() || isPending}>
          <Wand className="mr-2" />
          Summarize
        </Button>

        {isPending && <SummarySkeleton />}
        {error && <SummaryError message={error} />}
        {result && <SummaryResult result={result} />}

      </div>
    </div>
  );
}

function SummaryResult({ result }: { result: SummarizeTextOutput }) {
    return (
        <Card className="animate-fade-in-slide-up">
            <CardContent className="pt-6 space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="text-primary"/>
                    Summary
                </h3>
                <p className="text-muted-foreground">{result.summary}</p>
            </CardContent>
        </Card>
    )
}

function SummarySkeleton() {
    return (
        <Card>
            <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </CardContent>
        </Card>
    )
}

function SummaryError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive animate-fade-in-slide-up">
            <AlertTriangle />
            <p>{message}</p>
        </div>
    )
}
