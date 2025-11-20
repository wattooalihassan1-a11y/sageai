'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, ListChecks, Target, Wand, AlertTriangle } from 'lucide-react';
import { getProblemAnalysis } from '@/app/actions';
import type { AnalyzeProblemOutput } from '@/ai/flows/analyze-problem';
import { Skeleton } from './ui/skeleton';

export function Analyze() {
  const [problem, setProblem] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeProblemOutput | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!problem.trim()) return;
    setIsPending(true);
    setError(null);
    setAnalysis(null);

    const result = await getProblemAnalysis(problem);

    if (result.error) {
      setError(result.error);
    } else if (result.analysis) {
      setAnalysis(result.analysis);
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Analyze a Problem</h2>
      </div>
      
      <div className="flex-1 space-y-6">
        <p className="text-muted-foreground">
          Describe a complex problem or situation, and the AI will break it down into key components, identify potential root causes, and suggest initial steps for resolution.
        </p>
        
        <Textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g., Our team's productivity has dropped by 20% in the last quarter, and team morale seems low."
          className="min-h-[100px] bg-background"
          rows={4}
          disabled={isPending}
        />

        <Button onClick={handleAnalyze} disabled={!problem.trim() || isPending}>
          <Wand className="mr-2" />
          Analyze Problem
        </Button>

        {isPending && <AnalysisSkeleton />}
        {error && <AnalysisError message={error} />}
        {analysis && <AnalysisResult analysis={analysis} />}

      </div>
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: AnalyzeProblemOutput }) {
    return (
        <div className="space-y-6 pt-4 animate-fade-in-slide-up">
            <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ListChecks className="text-primary"/>
                    Key Components
                </h3>
                <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                    {analysis.keyComponents.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="text-primary"/>
                    Root Cause Analysis
                </h3>
                <p className="text-muted-foreground">{analysis.rootCause}</p>
            </div>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Wand className="text-primary"/>
                    Suggested First Steps
                </h3>
                <ul className="list-decimal list-inside pl-4 space-y-1 text-muted-foreground">
                    {analysis.firstSteps.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        </div>
    )
}

function AnalysisSkeleton() {
    return (
        <div className="space-y-6 pt-4">
            <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
            </div>
             <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}

function AnalysisError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive animate-fade-in-slide-up">
            <AlertTriangle />
            <p>{message}</p>
        </div>
    )
}
