
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, User, Bot, Copy, Check } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { getAiResponse } from '@/app/actions';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

const initialMessages: ChatMessageType[] = [
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
];

export function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: 'Copied to clipboard!',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsPending(true);

    const history = messages.map(({ role, content }) => ({ role, content }));
    
    // Hardcoded settings for now, can be made dynamic later
    const settings = { persona: 'Helpful Assistant', language: 'English' };

    const result = await getAiResponse(history, input, settings);

    if (result.error) {
        const errorMessage: ChatMessageType = {
            id: uuidv4(),
            role: 'assistant',
            content: result.error,
        };
        setMessages((prev) => [...prev, errorMessage]);
    } else {
        const assistantMessage: ChatMessageType = {
            id: uuidv4(),
            role: 'assistant',
            content: result.response || '',
            image: result.image,
        };
        setMessages((prev) => [...prev, assistantMessage]);
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Chat with AI</h2>
      </div>
      
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={message.id} message={message} onCopy={handleCopy} />
        ))}
        {isPending && (
            <div className="flex items-start gap-4 animate-fade-in-slide-up">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot size={20} />
                </div>
                <div className="flex-1 rounded-xl bg-muted p-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
                    </div>
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex items-start gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., How can I calculate the total return on an investment with compounding interest?"
          className="min-h-[40px] flex-1 resize-none bg-background"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          disabled={isPending}
        />
        <Button type="submit" disabled={!input.trim() || isPending} size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}


type ChatMessageProps = {
  message: ChatMessageType;
  onCopy: (text: string) => void;
};

function ChatMessage({ message, onCopy }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 animate-fade-in-slide-up',
        isUser ? 'justify-end' : ''
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot size={20} />
        </div>
      )}
      <div
        className={cn(
          'relative flex-1 max-w-[85%] rounded-xl p-4',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        {message.image ? (
          <img src={message.image} alt="Generated image" className="rounded-lg mb-2" />
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        {!isUser && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground"
            onClick={handleCopyClick}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User size={20} />
        </div>
      )}
    </div>
  );
}
