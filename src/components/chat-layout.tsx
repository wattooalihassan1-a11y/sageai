'use client';

import { useState } from 'react';
import { getAiResponse } from '@/app/actions';
import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
import type { ChatMessage, Settings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTabs } from './app-shell';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const initialMessages: ChatMessage[] = [
  {
    id: 'init',
    role: 'assistant',
    content: "Assalamu alaikum! I'm SageAI. How can I assist you today?",
  },
];

export function ChatLayout({ settings }: { settings: Settings }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { newChat } = useTabs();

  const handleNewChat = () => {
    setMessages(initialMessages);
    newChat();
  }

  const handleSubmit = async (values: { prompt: string; image?: string }) => {
    const { prompt, image } = values;
    if (!prompt.trim() && !image) return;
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
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

    const history = newMessages.map(({ role, content }) => ({ role, content }));

    const result = await getAiResponse(
      history.slice(0, -1),
      prompt,
      settings,
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
    <div className="relative flex flex-col h-full">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
