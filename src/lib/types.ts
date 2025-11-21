export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  audio?: string;
};

export type Settings = {
  language: string;
  persona: string;
};

export type ConversationHistory = {
  role: 'user' | 'assistant';
  content: string;
};

export type View = 'Solve' | 'Homework Helper' | 'Explain' | 'Summarize' | 'Get Idea';

export type Capability = {
  name: View;
  icon: React.ElementType;
  component: React.ReactElement<any>;
};
