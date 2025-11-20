'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAiResponse } from '@/app/actions';
import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import type { ChatMessage, Settings, ConversationHistory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { SageAI } from './icons';
import { SettingsPanel } from './settings-panel';
import { Separator } from './ui/separator';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogIn, LogOut, MessageSquare, Plus, UserPlus } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { SignUpForm } from './signup-form';

const initialMessages: ChatMessage[] = [
  {
    id: 'init',
    role: 'assistant',
    content: "Hello! I'm SageAI. How can I assist you today?",
  },
];

export function ChatLayout() {
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    language: 'English',
    persona: '',
  });
  const [showSignUp, setShowSignUp] = useState(false);

  const chatsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'chats'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: chats, loading: chatsLoading } = useCollection(chatsQuery);

  const activeChat = useMemo(() => {
    return chats?.find(chat => chat.id === activeChatId);
  }, [chats, activeChatId]);

  const chatMessagesQuery = useMemo(() => {
    if (!user || !firestore || !activeChatId) return null;
    return query(collection(firestore, 'users', user.uid, 'chats', activeChatId, 'messages'), orderBy('createdAt'));
  }, [user, firestore, activeChatId]);

  const { data: chatMessages, loading: chatMessagesLoading } = useCollection(chatMessagesQuery);

  useEffect(() => {
    if (chatMessages) {
      const loadedMessages: ChatMessage[] = chatMessages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        image: msg.image,
      }));
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        setMessages(initialMessages);
      }
    } else if (!activeChatId) {
        setMessages(initialMessages);
    }
  }, [chatMessages, activeChatId]);


  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages(initialMessages);
  }

  const handleSubmit = async (values: { prompt: string, image?: string }) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to start a chat.',
      });
      return;
    }
  
    let currentChatId = activeChatId;
  
    if (!currentChatId) {
      try {
        const chatRef = await addDoc(collection(firestore, 'users', user.uid, 'chats'), {
          title: values.prompt.substring(0, 30),
          createdAt: serverTimestamp(),
          userId: user.uid,
        });
        currentChatId = chatRef.id;
        setActiveChatId(currentChatId);
      } catch (error) {
        console.error("Error creating new chat:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not start a new chat.' });
        return;
      }
    }
  
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: values.prompt,
      image: values.image,
    };
  
    const newMessages = messages[0].id === 'init' ? [userMessage] : [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
  
    const pendingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      isPending: true,
    };
    setMessages((prev) => [...prev, pendingMessage]);
  
    const history: ConversationHistory[] = newMessages.map(
      ({ role, content, image }) => ({ role, content, image })
    );
  
    if (currentChatId) {
        await addDoc(collection(firestore, 'users', user.uid, 'chats', currentChatId, 'messages'), {
            role: 'user',
            content: values.prompt,
            image: values.image || null,
            createdAt: serverTimestamp(),
            userId: user.uid,
        });
    }

    const result = await getAiResponse(
      history,
      values.prompt,
      settings.language,
      settings.persona,
      values.image
    );
  
    setIsLoading(false);
  
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => prev.slice(0, -1));
    } else {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.response,
      };
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);

      if (currentChatId) {
        await addDoc(collection(firestore, 'users', user.uid, 'chats', currentChatId, 'messages'), {
            role: 'assistant',
            content: result.response,
            createdAt: serverTimestamp(),
            userId: user.uid,
        });
      }
    }
  };

  const handleLogin = async () => {
    if (!auth || !firestore) return;
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const { user } = result;

      // Create user document in Firestore if it doesn't exist
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, { 
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }, { merge: true });

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
          return;
      }
      if (error.code === 'auth/configuration-not-found') {
          toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'Google Sign-In is not enabled for this project. Please enable it in the Firebase console.',
            duration: 10000,
          });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to sign in with Google.',
        });
      }
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setActiveChatId(null);
      setMessages(initialMessages);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out.',
      });
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <SageAI className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-headline font-semibold">SageAI</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={handleNewChat}>
              <Plus />
            </Button>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-2">
            <p className="text-sm font-medium text-muted-foreground p-2">Recent</p>
            <SidebarMenu>
              {chatsLoading ? (
                <p className='text-sm text-center text-muted-foreground'>Loading chats...</p>
              ) : (
                chats?.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton 
                        isActive={activeChatId === chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                    >
                      <MessageSquare />
                      {chat.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          {userLoading ? (
             <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback />
                </Avatar>
                <p>Loading...</p>
            </div>
          ) : user ? (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                  <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.displayName}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut />
              </Button>
            </div>
          ) : (
            null
          )}
          <Separator />
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <div className="p-2 border-b flex items-center gap-2 md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <SageAI className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-headline font-semibold">SageAI</h1>
            </div>
        </div>
        <ChatMessages messages={messages} isLoading={chatMessagesLoading} />
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </SidebarInset>
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Enter your details below to create a new account.
            </DialogDescription>
          </DialogHeader>
          <SignUpForm onSignUp={() => setShowSignUp(false)} />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
