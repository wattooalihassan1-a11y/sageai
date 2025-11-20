export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isPending?: boolean;
  image?: string;
};

export type Settings = {
  language: string;
  persona: string;
  fontSize: number;
};

export type ConversationHistory = {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};
