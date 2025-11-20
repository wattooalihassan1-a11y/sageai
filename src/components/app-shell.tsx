'use client';

import { cn } from '@/lib/utils';
import { Menu, MessageSquare, Plus, Settings2 } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WisdomAI } from './icons';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import type { ChatMessage } from '@/lib/types';

type AppShellContextType = {
  newChat: (clear?: boolean) => void;
  loadChat: (chatId: string) => void;
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

  const newChat = (clear = true) => {
    if (clear && typeof window !== 'undefined') {
      const activeId = localStorage.getItem('activeChatId');
      if (activeId) {
        localStorage.removeItem(`chatHistory_${activeId}`);
      }
      localStorage.removeItem('activeChatId');
    }
    setChatKey(prev => prev + 1);
  };
  
  const loadChat = (chatId: string) => {
    localStorage.setItem('activeChatId', chatId);
    newChat(false);
  };

  return (
    <AppShellContext.Provider value={{ newChat, loadChat }}>
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
  const { newChat, loadChat } = useAppShell();
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = () => {
      const keys = Object.keys(localStorage);
      const history: Record<string, ChatMessage[]> = {};
      keys.forEach(key => {
        if (key.startsWith('chatHistory_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
             history[key.replace('chatHistory_', '')] = JSON.parse(stored);
          }
        }
      });
      setChatHistory(history);
      setActiveChatId(localStorage.getItem('activeChatId'));
    };

    loadHistory();
    const handleStorageChange = () => {
        loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
}, []);

  const sortedChats = Object.entries(chatHistory).sort((a, b) => {
    const aLast = a[1][a[1].length-1];
    const bLast = b[1][b[1].length-1];
    if (!aLast || !bLast) return 0;
    // Assuming messages have a timestamp property, otherwise use id.
    // For this example, we'll assume new chats are added and have recent messages.
    // A more robust implementation would use timestamps.
    return (b[1][0]?.id || 0) > (a[1][0]?.id || 0) ? 1: -1;
  });

  return (
    <div className="flex flex-col h-full bg-background p-4">
      <div className="flex-1 mt-4 space-y-1 overflow-y-auto">
        {sortedChats.map(([id, messages]) => {
          if (!messages || messages.length === 0) return null;
          const firstUserMessage = messages.find(m => m.role === 'user');
          const title = firstUserMessage ? firstUserMessage.content.substring(0, 30) : 'New Chat';
          return (
             <Button
                key={id}
                variant={activeChatId === id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => loadChat(id)}
             >
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{title}{!firstUserMessage && '...'}</span>
             </Button>
          )
        })}
      </div>
      <div className="mt-auto">
         <div className="flex flex-col items-center justify-center text-center text-xs text-muted-foreground">
          <WisdomAI className="h-6 w-6 mb-1" />
          <span>by Ali Hassan Wattoo</span>
        </div>
      </div>
    </div>
  );
}
