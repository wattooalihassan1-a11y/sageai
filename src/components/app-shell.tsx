'use client';

import { BrainCircuit } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex items-center gap-3 border-b bg-background p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Problem Solver AI</h1>
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
