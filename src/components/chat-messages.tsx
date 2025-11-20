'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
import { Check, Clipboard } from 'lucide-react';

type Props = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export function ChatMessages({ messages, isLoading }: Props) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);
  
  const handleCopy = (content: string, id: string) => {
    // Remove HTML tags for a clean copy
    const plainText = content.replace(/<br \/>/g, '\n').replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(plainText);
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
        {isLoading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn('flex items-start gap-4 animate-fade-in-slide-up', {
              'justify-end': message.role === 'user',
            })}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <div
              className={cn(
                'group relative max-w-[80%] break-words text-sm',
                {
                  'bg-white text-black rounded-xl p-3 shadow-md': message.role === 'user',
                  'bg-card p-3 rounded-lg': message.role === 'assistant',
                }
              )}
            >
              {message.image && (
                <div className="relative w-48 h-48 mb-2 rounded-md overflow-hidden border">
                  <Image src={message.image} alt="user upload" fill className="object-cover" />
                </div>
              )}
              {message.isPending ? (
                <div className="flex items-center justify-center gap-2 p-1">
                  <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-current rounded-full animate-pulse"></span>
                </div>
              ) : message.content ? (
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
              ) : null}

              {message.role === 'assistant' && !message.isPending && message.content && (
                <div className='absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(message.content, message.id)}
                    className="h-8 w-8"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
