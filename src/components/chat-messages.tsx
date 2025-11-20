'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChatAvatar } from './chat-avatar';
import Image from 'next/image';

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
      <div className="p-4 md:p-6 space-y-6">
        {isLoading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center justify-center gap-2">
              <span className="h-3 w-3 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
              <span className="h-3 w-3 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
              <span className="h-3 w-3 bg-primary rounded-full animate-pulse"></span>
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn('flex items-start gap-4', {
              'flex-row-reverse': message.role === 'user',
            })}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <ChatAvatar message={message} />
            <div
              className={cn(
                'rounded-lg p-3 max-w-[80%] break-words text-sm',
                {
                  'bg-primary text-primary-foreground': message.role === 'user',
                  'bg-card': message.role === 'assistant',
                }
              )}
            >
              {message.image && (
                <div className="relative w-48 h-48 mb-2 rounded-md overflow-hidden">
                  <Image src={message.image} alt="user upload" fill className="object-cover" />
                </div>
              )}
              {message.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-current rounded-full animate-pulse"></span>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
