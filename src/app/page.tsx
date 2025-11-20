'use client';
import { ChatLayout } from "@/components/chat-layout";
import { useTabs } from "@/components/app-shell";
import { SettingsPanel } from "@/components/settings-panel";
import { useState } from "react";
import type { Settings } from "@/lib/types";

export default function Home() {
  const { activeTab } = useTabs();
  const [settings, setSettings] = useState<Settings>({
    language: 'English',
    persona: 'You are a helpful AI assistant.',
  });

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="h-full">
      {activeTab === 'chat' && <ChatLayout settings={settings} />}
      {activeTab === 'settings' && <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />}
    </div>
  );
}
