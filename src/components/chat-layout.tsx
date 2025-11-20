'use client';

import { useState, useEffect } from 'react';
import { getAiResponse } from '@/app/actions';
import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
import type { ChatMessage, Settings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAppShell } from './app-shell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Settings2, Languages, User } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const initialMessages: ChatMessage[] = [
  {
    id: 'init',
    role: 'assistant',
    content: "Assalamu alaikum! I'm Wisdom AI. How can I assist you today?",
  },
];

const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Japanese',
  'Korean',
  'Russian',
  'Hindi',
  'Urdu',
];

type Props = {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
};

export function ChatLayout({ settings, onSettingsChange }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { newChat } = useAppShell();
  const [isClient, setIsClient] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!isClient) return;
    try {
      const chatId = localStorage.getItem('activeChatId') || `chat_${Date.now()}`;
      setActiveChatId(chatId);
      localStorage.setItem('activeChatId', chatId);

      const storedMessages = localStorage.getItem(`chatHistory_${chatId}`);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
           setMessages(parsedMessages);
        } else {
            setMessages(initialMessages);
        }
      } else {
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
       setMessages(initialMessages);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !activeChatId) return;
    try {
        if (messages.length > 1 || (messages.length === 1 && messages[0].id !== 'init')) {
          localStorage.setItem(`chatHistory_${activeChatId}`, JSON.stringify(messages));
        } else {
           localStorage.removeItem(`chatHistory_${activeChatId}`);
        }
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [messages, isClient, activeChatId]);

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
      content: result.response || '',
      image: result.image,
    };

    setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
  };

  return (
    <div className="relative flex flex-col h-full">
      <header className="grid grid-cols-3 items-center p-4 border-b">
        <div className="w-10"></div>
        <div className="flex items-baseline justify-center text-center gap-2">
            <h1 className="text-xl font-semibold">Wisdom AI</h1>
            <span className="text-xs text-muted-foreground">by Ali Hassan Wattoo</span>
        </div>
        <div className="flex justify-end">
          <SettingsMenu settings={settings} onSettingsChange={onSettingsChange} />
        </div>
      </header>

      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

function SettingsMenu({ settings, onSettingsChange }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" /> Language
            </Label>
            <Select
              value={settings.language}
              onValueChange={(value) => onSettingsChange({ language: value })}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="persona" className="flex items-center gap-2">
              <User className="h-4 w-4" /> AI Persona
            </Label>
            <Textarea
              id="persona"
              placeholder="e.g., A helpful assistant."
              value={settings.persona}
              onChange={(e) => onSettingsChange({ persona: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
