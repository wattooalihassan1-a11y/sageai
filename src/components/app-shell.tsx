'use client';

import { cn } from '@/lib/utils';
import { Menu, MessageSquare, Plus, Settings2 } from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';
import { SageAI } from './icons';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

type AppShellContextType = {
  newChat: () => void;
};

const AppShellContext = createContext<AppShellContextType | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShell');
  }
  return context;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [chatKey, setChatKey] = useState(0);

  const newChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatHistory');
    }
    setChatKey(prev => prev + 1);
  };

  return (
    <AppShellContext.Provider value={{ newChat }}>
      <div className="flex h-screen w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-10 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <aside className="hidden md:flex md:flex-col w-72 border-r">
          <Sidebar />
        </aside>

        <main className="flex-1 flex flex-col" key={chatKey}>
          {children}
        </main>
      </div>
    </AppShellContext.Provider>
  );
}

function Sidebar() {
  const { newChat } = useAppShell();
  return (
    <div className="flex flex-col h-full bg-background p-4">
      <Button
        onClick={newChat}
        className="w-full justify-start gap-2"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </Button>
      <div className="flex-1 mt-4 space-y-2 overflow-y-auto">
        {/* Chat history will go here */}
      </div>
      <div className="mt-auto">
         <div className="flex flex-col items-center justify-center text-center text-xs text-muted-foreground">
          <SageAI className="h-6 w-6 mb-1" />
        </div>
      </div>
    </div>
  );
}
