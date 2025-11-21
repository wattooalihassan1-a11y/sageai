'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookMarked, AlertTriangle, Wand, ClipboardCopy, CheckCircle } from 'lucide-react';
import { getHomeworkHelp } from '@/app/actions';
import type { HomeworkHelperOutput } from '@/ai/flows/homework-helper';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export type HomeworkData = {
  input: string;
  result: HomeworkHelperOutput;
}

interface HomeworkHelperProps {
  initialData?: HomeworkData | null;
}

export function HomeworkHelper({ initialData }: HomeworkHelperProps) {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<HomeworkHelperOutput | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.input);
      setResult(initialData.result);
    }
  }, [initialData]);

  const handleGetHelp = async () => {
    if (!question.trim()) return;
    setIsPending(true);
    setError(null);
    setResult(null);

    const response = await getHomeworkHelp(question);

    if (response.error) {
      setError(response.error);
    } else if (response.result) {
      setResult(response.result);
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <BookMarked className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Homework Helper</h2>
      </div>
      
      <div className="flex-1 space-y-6">
        <p className="text-muted-foreground">
          Enter your homework question, and the AI will provide a step-by-step guide to help you find the solution.
        </p>
        
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What was the main cause of the French Revolution?"
          className="min-h-[100px] bg-background"
          rows={4}
          disabled={isPending}
        />

        <Button onClick={handleGetHelp} disabled={!question.trim() || isPending}>
          <Wand className="mr-2" />
          Get Help
        </Button>

        {isPending && <ResultSkeleton />}
        {error && <ResultError message={error} />}
        {result && <HomeworkResult result={result} />}

      </div>
    </div>
  );
}

function HomeworkResult({ result }: { result: HomeworkHelperOutput }) {
    const { toast } = useToast();

    const handleCopy = () => {
        const textToCopy = `
Step-by-step Solution:
${result.steps.map((step, i) => `
Step ${i + 1}: ${step.title}
${step.explanation}
`).join('')}

Final Answer:
${result.finalAnswer}
        `.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({
                description: 'Solution copied to clipboard!',
            });
        });
    };

    return (
        <Card className="animate-fade-in-slide-up">
            <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Step-by-Step Solution</CardTitle>
                 <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <ClipboardCopy />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {result.steps.map((step, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger>
                                <span className='text-left'>{`Step ${i + 1}: ${step.title}`}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                {step.explanation}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle className="text-green-500"/>
                        Final Answer
                    </h3>
                    <p className="text-muted-foreground">{result.finalAnswer}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function ResultSkeleton() {
    return (
        <div className="space-y-4 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3 pt-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    )
}

function ResultError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive animate-fade-in-slide-up">
            <AlertTriangle />
            <p>{message}</p>
        </div>
    )
}
