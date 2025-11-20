'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ChatAvatar } from './chat-avatar';

type Props = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export function ChatMessages({ messages, isLoading }: Props) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

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
            className={cn('flex items-start gap-4', {
              'justify-end': message.role === 'user',
            })}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <div
              className={cn(
                'rounded-xl p-3 max-w-[80%] break-words text-sm',
                {
                  'bg-primary text-primary-foreground': message.role === 'user',
                  'bg-muted': message.role === 'assistant',
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
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
