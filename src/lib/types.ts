export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isPending?: boolean;
};

export type Settings = {
  language: string;
  persona: string;
  fontSize: number;
};

export type ConversationHistory = {
  role: 'user' | 'assistant';
  content: string;
};
