'use client';

import { useState, useRef, useEffect } from 'react';
import { getAiResponse, getAudioResponse } from '@/app/actions';
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio element on client
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }
  }, []);

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  const handleSubmit = async (values: { prompt: string; image?: string, audio?: string }) => {
    const { prompt, image, audio } = values;
    if (!prompt.trim() && !image && !audio) return;
    setIsLoading(true);

    const userMessageContent = prompt || (audio ? '🎤 Audio input' : '');

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
    
    // Call AI with text, image, and/or audio
    const result = await getAiResponse(
      history.slice(0, -1),
      prompt,
      image,
      audio
    );

    if (result.error) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => prev.slice(0, -1));
      return;
    }

    // If audio was sent, update the user message with the transcribed text
    if (audio && result.transcribedText) {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, content: result.transcribedText } : msg
      ));
    }

    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: result.response,
    };

    // Generate audio for the AI response
    const audioResult = await getAudioResponse(result.response);
    if (audioResult.audio) {
      aiMessage.audio = audioResult.audio;
      playAudio(audioResult.audio);
    } else if (audioResult.error) {
        toast({
            variant: 'destructive',
            title: 'Audio Error',
            description: audioResult.error,
        });
    }

    setIsLoading(false);
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
            Start chatting or use the microphone to talk.
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
        <ChatMessages messages={messages} isLoading={false} onPlayAudio={playAudio} />
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </SidebarInset>
    </SidebarProvider>
  );
}
