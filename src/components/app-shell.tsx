'use client';

import { BrainCircuit } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex items-center gap-2 border-b bg-background px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-lg font-bold tracking-tight">Clarity AI</h1>
          <span className="text-xs text-muted-foreground">by NextGenDeveloper Ali Hassan</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
