'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquareQuote, BookOpen, Repeat, AlertTriangle, Wand, ClipboardCopy } from 'lucide-react';
import { getTopicExplanation } from '@/app/actions';
import type { ExplainTopicOutput } from '@/ai/flows/explain-topic';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';

export function Explain() {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState<ExplainTopicOutput | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!topic.trim()) return;
    setIsPending(true);
    setError(null);
    setExplanation(null);

    const result = await getTopicExplanation(topic);

    if (result.error) {
      setError(result.error);
    } else if (result.explanation) {
      setExplanation(result.explanation);
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquareQuote className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Explain a Topic</h2>
      </div>
      
      <div className="flex-1 space-y-6">
        <p className="text-muted-foreground">
          Enter a topic or concept you want to understand, and the AI will provide a simple explanation, examples, and an analogy.
        </p>
        
        <div className="flex items-center gap-2">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Computing"
              className="bg-background"
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExplain();
              }}
            />
            <Button onClick={handleExplain} disabled={!topic.trim() || isPending}>
              <Wand className="mr-2" />
              Explain
            </Button>
        </div>

        {isPending && <ExplanationSkeleton />}
        {error && <ExplanationError message={error} />}
        {explanation && <ExplanationResult explanation={explanation} />}

      </div>
    </div>
  );
}

function ExplanationResult({ explanation }: { explanation: ExplainTopicOutput }) {
    const { toast } = useToast();

    const handleCopy = () => {
        const textToCopy = `
Explanation:
${explanation.explanation}

Examples:
- ${explanation.examples.join('\n- ')}

Analogy:
${explanation.analogy}
        `.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({
                description: 'Explanation copied to clipboard!',
            });
        });
    };

    return (
        <Card className="animate-fade-in-slide-up">
            <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Explanation</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <ClipboardCopy />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="text-primary"/>
                        Explanation
                    </h3>
                    <p className="text-muted-foreground">{explanation.explanation}</p>
                </div>
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Wand className="text-primary"/>
                        Examples
                    </h3>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                        {explanation.examples.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Repeat className="text-primary"/>
                        Analogy
                    </h3>
                    <p className="text-muted-foreground">{explanation.analogy}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function ExplanationSkeleton() {
    return (
        <Card>
            <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-4/5" />
                     <Skeleton className="h-4 w-4/5" />
                </div>
                 <div className="space-y-3">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}

function ExplanationError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive animate-fade-in-slide-up">
            <AlertTriangle />
            <p>{message}</p>
        </div>
    )
}
