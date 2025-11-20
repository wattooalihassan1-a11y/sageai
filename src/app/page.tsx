'use client';

import { ChatLayout } from "@/components/chat-layout";
import { useState } from "react";
import type { Settings } from "@/lib/types";

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    language: 'English',
    persona: 'You are a helpful AI assistant. Provide direct, point-to-point answers. Be concise and to the point.',
  });

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="h-full">
      <ChatLayout settings={settings} onSettingsChange={handleSettingsChange} />
    </div>
  );
}
