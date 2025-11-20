'use client';

import type { Settings } from '@/lib/types';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

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
];

type Props = {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
};

export function SettingsPanel({ settings, onSettingsChange }: Props) {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
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
        <Label htmlFor="persona">AI Persona</Label>
        <Textarea
          id="persona"
          placeholder="e.g., A helpful assistant that talks like a pirate."
          value={settings.persona}
          onChange={(e) => onSettingsChange({ persona: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
