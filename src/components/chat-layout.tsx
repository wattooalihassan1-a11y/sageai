'use client';

import { useState, useRef, useEffect } from 'react';
import { getAiResponse } from '@/app/actions';
import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import type { ChatMessage, Settings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { SageAI } from './icons';
import { SettingsPanel } from './settings-panel';
import { Separator } from './ui/separator';

const initialMessages: ChatMessage[] = [
  {
    id: 'init',
    role: 'assistant',
    content: "Hello! I'm SageAI. How can I assist you today?",
  },
];

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    language: 'English',
    persona: '',
  });

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSubmit = async (values: { prompt: string; image?: string }) => {
    const { prompt, image } = values;
    if (!prompt.trim() && !image) return;
    setIsLoading(true);

    const userMessageContent = prompt;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessageContent,
      image: image,
    };
    
    const currentMessages = messages[0].id === 'init' ? [] : messages;
    const newMessages = [...currentMessages, userMessage];
    setMessages(newMessages);

    const pendingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      isPending: true,
    };
    setMessages((prev) => [...prev, pendingMessage]);

    const history = newMessages.map(({ role, content }) => ({
      role,
      content,
    }));
    
    // Call AI with text and/or image
    const result = await getAiResponse(
      history.slice(0, -1),
      prompt,
      image
    );

    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => prev.slice(0, -1));
      return;
    }

    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: result.response,
    };
    
    setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <SageAI className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-headline font-semibold">SageAI</h1>
            </div>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-2">
          <p className="text-sm font-medium text-muted-foreground p-2">
            Start chatting by typing a message.
          </p>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <div className="p-2 border-b flex items-center gap-2 md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <SageAI className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-headline font-semibold">SageAI</h1>
          </div>
        </div>
        <ChatMessages messages={messages} isLoading={false} />
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </SidebarInset>
    </SidebarProvider>
  );
}
