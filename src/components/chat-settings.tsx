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
import type { Settings } from '@/lib/types';

interface ChatSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
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
}: ChatSettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize the AI assistant&apos;s behavior.
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
      </SheetContent>
    </Sheet>
  );
}
