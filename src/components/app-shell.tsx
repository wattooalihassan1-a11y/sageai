
'use client';

import { cn } from '@/lib/utils';
import { MessageCircle, Settings } from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';
import { SageAI } from './icons';

type Tab = 'chat' | 'settings';

type AppShellContextType = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  newChat: () => void;
};

const AppShellContext = createContext<AppShellContextType | null>(null);

export function useTabs() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useTabs must be used within an AppShell');
  }
  return context;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  
  // This key is used to force a re-render of the chat page
  const [chatKey, setChatKey] = useState(0);

  const newChat = () => {
    setChatKey(prev => prev + 1);
    setActiveTab('chat');
  }

  return (
    <AppShellContext.Provider value={{ activeTab, setActiveTab, newChat }}>
      <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <SageAI className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-headline font-semibold">SageAI</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div key={activeTab === 'chat' ? chatKey : activeTab}>
            {children}
          </div>
        </main>

        <footer className="flex justify-around p-2 border-t bg-card">
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg w-24',
              activeTab === 'chat' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            )}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs font-medium">Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg w-24',
              activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            )}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </footer>
      </div>
    </AppShellContext.Provider>
  );
}
