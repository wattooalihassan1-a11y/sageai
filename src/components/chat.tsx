'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Settings as SettingsIcon, ClipboardCopy, Paperclip, X, Mic, Trash2, Check } from 'lucide-react';
import type { ChatMessage as ChatMessageType, Settings, View, Chat as ChatType } from '@/lib/types';
import { getAiResponse } from '@/app/actions';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { ChatSettings } from './chat-settings';
import { useChatHistory } from '@/hooks/use-chat-history';

const initialMessages: ChatMessageType[] = [
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
];

interface ChatProps {
    onViewChange?: (view: View, data: any) => void;
}

export function Chat({ onViewChange }: ChatProps) {
  const { chats, activeChat, setActiveChat, createNewChat, deleteChat, updateChat } = useChatHistory(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    language: 'English',
    persona: 'Helpful Assistant',
  });
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
            }
        }, 0);
    }
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent, voiceInput?: string) => {
    if (e) e.preventDefault();
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    const currentInput = voiceInput || input;
    if ((!currentInput.trim() && !image) || isPending) return;

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      content: currentInput,
      image: image,
    };
    
    const newMessages = [...(activeChat?.messages ?? []), userMessage];
    updateChat(activeChat!.id, { messages: newMessages });

    setInput('');
    setImage(undefined);
    setIsPending(true);

    try {
      const history = newMessages.slice(-6, -1).map(({ role, content }) => ({ role, content }));
      
      const result = await getAiResponse(history, currentInput, settings, image);

      let finalMessages = [...newMessages];

      if (result.error) {
          const errorMessage: ChatMessageType = {
              id: uuidv4(),
              role: 'assistant',
              content: result.error,
          };
          finalMessages.push(errorMessage);
      } else {
          const assistantMessage: ChatMessageType = {
              id: uuidv4(),
              role: 'assistant',
              content: result.response || '',
              image: result.image,
              audio: result.audio,
          };
          finalMessages.push(assistantMessage);

          if (result.view && result.data && onViewChange) {
            setTimeout(() => {
              onViewChange(result.view!, result.data);
            }, 1000);
          }
      }
      updateChat(activeChat!.id, { messages: finalMessages, title: finalMessages.find(m => m.role === 'user')?.content });
    } finally {
        setIsPending(false);
    }
  }, [input, image, isPending, settings, onViewChange, isRecording, activeChat, updateChat]);

  useEffect(() => {
    if ((activeChat?.messages?.length ?? 0) > 1 || isPending) {
        scrollToBottom();
    }
  }, [activeChat?.messages, isPending, scrollToBottom]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        toast({ variant: 'destructive', description: `Speech recognition error: ${event.error}` });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, [toast]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVoiceRecording = () => {
    if (!recognitionRef.current) {
        toast({ variant: 'destructive', description: 'Speech recognition is not supported in your browser.' });
        return;
    }

    if (isRecording) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.start();
        setIsRecording(true);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
        handleStopRecording(true);
    }
    handleSubmit(e);
  };

  const handleStopRecording = (shouldSubmit: boolean) => {
    if (recognitionRef.current) {
        if (shouldSubmit) {
            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                handleSubmit(undefined, transcript);
            };
        } else {
            recognitionRef.current.onresult = () => {};
        }
        recognitionRef.current.stop();
        setIsRecording(false);
    }
  };
  
  const handleMessageUpdate = (updatedMessage: ChatMessageType) => {
    if (activeChat) {
      const updatedMessages = activeChat.messages.map(m => m.id === updatedMessage.id ? updatedMessage : m);
      updateChat(activeChat.id, { messages: updatedMessages });
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
            <div className='flex items-center gap-3'>
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Chat with AI</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                <SettingsIcon />
            </Button>
        </div>
        
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
          {(activeChat?.messages ?? []).map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isPending && (
              <div className="flex items-start gap-4 animate-fade-in-slide-up">
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

        <div className="mt-6">
          {image && (
            <div className="relative w-24 h-24 mb-2 rounded-md overflow-hidden">
              <img src={image} alt="Selected" className="w-full h-full object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-6 w-6 bg-black/50 hover:bg-black/75 text-white"
                onClick={() => setImage(undefined)}
              >
                <X size={14} />
              </Button>
            </div>
          )}
          <form 
            onSubmit={handleFormSubmit} 
            className={cn(
              "relative flex w-full items-start gap-2 rounded-xl border bg-background pr-2 shadow-sm transition-all",
              isFocused ? "ring-2 ring-primary ring-offset-2" : ""
            )}
          >
            {isRecording ? (
                <div className="flex items-center justify-between w-full p-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleStopRecording(false)}>
                        <Trash2 className='text-destructive' />
                    </Button>
                    <div className="flex items-center gap-1.5">
                        <span className="h-4 w-1 animate-[voice-wave_1s_infinite_ease-in-out] rounded-full bg-primary [animation-delay:-0.3s]"></span>
                        <span className="h-6 w-1 animate-[voice-wave_1s_infinite_ease-in-out] rounded-full bg-primary [animation-delay:-0.15s]"></span>
                        <span className="h-5 w-1 animate-[voice-wave_1s_infinite_ease-in-out] rounded-full bg-primary"></span>
                        <span className="h-6 w-1 animate-[voice-wave_1s_infinite_ease-in-out] rounded-full bg-primary [animation-delay:-0.15s]"></span>
                        <span className="h-4 w-1 animate-[voice-wave_1s_infinite_ease-in-out] rounded-full bg-primary [animation-delay:--0.3s]"></span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleStopRecording(true)}>
                        <Check className='text-green-500' />
                    </Button>
                </div>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 ml-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                >
                  <Paperclip size={18} />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Clarity AI..."
                  className="min-h-[40px] flex-1 resize-none border-0 bg-transparent px-0 py-2 focus-visible:ring-0"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleFormSubmit(e);
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isPending}
                  autoFocus
                />
                <div className='flex items-center self-center'>
                  <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={handleToggleVoiceRecording}
                      disabled={isPending}
                  >
                      <Mic size={18} />
                  </Button>
                  <Button type="submit" disabled={(!input.trim() && !image) || isPending} size="icon">
                      <Send size={18} />
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <ChatSettings 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
        chatHistory={chats}
        onSelectChat={(chatId) => setActiveChat(chatId)}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        activeChatId={activeChat?.id}
      />
    </>
  );
}


type ChatMessageProps = {
  message: ChatMessageType;
};

function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.role === 'user';
  
  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content).then(() => {
        toast({
          description: 'Copied to clipboard!',
        });
      });
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 animate-fade-in-slide-up group',
        isUser ? 'justify-end' : ''
      )}
    >
      <div
        className={cn(
          'relative flex-1 max-w-[85%] rounded-xl p-4',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        {message.image && (
          <img src={message.image} alt="Generated content" className="rounded-lg mb-2 max-w-full" />
        )}
        {message.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        <div className={cn(
          "absolute -bottom-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? '-left-2' : '-right-2'
        )}>
            {!isUser && message.content && (
               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                 <ClipboardCopy size={16} />
               </Button>
            )}
        </div>
      </div>
    </div>
  );
}
