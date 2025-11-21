'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Chat, ChatMessage } from '@/lib/types';

const CHAT_HISTORY_KEY = 'chatHistory';

export function useChatHistory(initialMessages: ChatMessage[]) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      const parsedHistory: Chat[] = savedHistory ? JSON.parse(savedHistory) : [];
      
      const newChatId = uuidv4();
      const newChat: Chat = {
        id: newChatId,
        title: 'New Chat',
        createdAt: Date.now(),
        messages: initialMessages,
      };

      const updatedChats = [newChat, ...parsedHistory];
      setChats(updatedChats);
      setActiveChatId(newChatId);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedChats));

    } catch (error) {
      console.error("Failed to load or create chat history from localStorage", error);
      // Fallback to initial state if localStorage fails
      const newChatId = uuidv4();
      const newChat = {
        id: newChatId,
        title: 'New Chat',
        createdAt: Date.now(),
        messages: initialMessages,
      };
      setChats([newChat]);
      setActiveChatId(newChatId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveChats = useCallback((updatedChats: Chat[]) => {
    try {
      const sortedChats = updatedChats.sort((a, b) => b.createdAt - a.createdAt);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sortedChats));
      setChats(sortedChats);
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, []);

  const createNewChat = useCallback(() => {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      createdAt: Date.now(),
      messages: initialMessages,
    };
    const updatedChats = [newChat, ...chats];
    saveChats(updatedChats);
    setActiveChatId(newChatId);
  }, [chats, initialMessages, saveChats]);

  const deleteChat = useCallback((chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    saveChats(updatedChats);

    if (activeChatId === chatId) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id);
      } else {
        // If all chats are deleted, create a new one
        createNewChat();
      }
    }
  }, [chats, activeChatId, saveChats, createNewChat]);

  const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
    const updatedChats = chats.map(chat =>
      chat.id === chatId ? { ...chat, ...updates, createdAt: Date.now() } : chat
    );
    saveChats(updatedChats);
  }, [chats, saveChats]);

  const setActiveChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return {
    chats,
    activeChat,
    setActiveChat,
    createNewChat,
    deleteChat,
    updateChat,
  };
}
