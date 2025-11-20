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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { SageAI } from './icons';

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
  'Urdu'
];

type Props = {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
};

export function SettingsPanel({ settings, onSettingsChange }: Props) {
  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Persona</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="persona"
            placeholder="e.g., A helpful assistant that talks like a pirate."
            value={settings.persona}
            onChange={(e) => onSettingsChange({ persona: e.target.value })}
            rows={5}
          />
        </CardContent>
      </Card>

      <div className="pt-8">
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <SageAI className="h-8 w-8 mb-2" />
          <p className="text-sm">Developed by</p>
          <p className="font-semibold text-foreground">Ali Hassan Wattoo</p>
        </div>
      </div>
    </div>
  );
}
