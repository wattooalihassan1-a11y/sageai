'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Settings, Chat } from '@/lib/types';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  chatHistory: Chat[];
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

const languages = [
  'English',
  'Urdu',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Arabic',
  'Chinese (Mandarin)',
  'Japanese',
  'Portuguese',
  'Russian',
];

const personas = [
  'Helpful Assistant',
  'Sarcastic Assistant',
  'Code-Writing Assistant',
  'Creative Writing Assistant',
  'Business Consultant',
  'Travel Agent',
];

export function ChatSettings({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  chatHistory,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatSettingsProps) {

  const handleNewChat = () => {
    onNewChat();
    onOpenChange(false);
  };

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize the AI assistant&apos;s behavior and manage your chats.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, language: value })
              }
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
            <Label htmlFor="persona">Persona</Label>
            <Select
              value={settings.persona}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, persona: value })
              }
            >
              <SelectTrigger id="persona">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((persona) => (
                  <SelectItem key={persona} value={persona}>
                    {persona}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 border-t pt-4">
          <div className='flex items-center justify-between mb-2'>
            <h3 className="text-lg font-semibold">Recent Chats</h3>
            <Button variant="outline" size="sm" onClick={handleNewChat}>
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex items-center justify-between rounded-md p-2 cursor-pointer",
                    activeChatId === chat.id ? "bg-primary/10" : "hover:bg-accent"
                  )}
                >
                  <div className='flex-1 truncate' onClick={() => handleSelectChat(chat.id)}>
                    <p className="font-medium truncate">{chat.title || 'New Chat'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDeleteChat(chat.id)}>
                    <Trash2 className='h-4 w-4 text-destructive'/>
                  </Button>
                </div>
              ))}
              {chatHistory.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent chats found.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

      </SheetContent>
    </Sheet>
  );
}
