'use client';

import { Logo } from './logo';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex items-center gap-3 border-b bg-background p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          <Logo className="h-8 w-8" />
        </div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold tracking-tight">Clarity AI</h1>
          <span className="text-[10px] text-muted-foreground">
            by NextGenDeveloper Ali Hassan
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
