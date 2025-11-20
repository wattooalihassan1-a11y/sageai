'use client';

import { useState, useEffect } from 'react';
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
} from '@/components/ui/sidebar';
import type { ChatMessage, Settings, ConversationHistory } from '@/lib/types';
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
    fontSize: 14,
  });

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSubmit = async (values: { prompt: string, image?: string }) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: values.prompt,
      image: values.image,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const pendingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      isPending: true,
    };
    setMessages((prev) => [...prev, pendingMessage]);

    const history: ConversationHistory[] = newMessages.map(
      ({ role, content, image }) => ({ role, content, image })
    );

    const result = await getAiResponse(
      history,
      values.prompt,
      settings.language,
      settings.persona,
      values.image
    );

    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove pending message
    } else {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.response,
      };
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <SageAI className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">SageAI</h1>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <div className="p-2 border-b flex items-center gap-2 md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <SageAI className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-headline font-semibold">SageAI</h1>
            </div>
        </div>
        <ChatMessages messages={messages} fontSize={settings.fontSize} />
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </SidebarInset>
    </SidebarProvider>
  );
}
