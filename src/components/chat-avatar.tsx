import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatMessage } from "@/lib/types";
import { WisdomAI } from "./icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

type Props = {
  message: ChatMessage;
};

export function ChatAvatar({ message }: Props) {
  const assistantAvatar = PlaceHolderImages.find(p => p.id === 'wisdom-ai-logo');

  if (message.role === "user") {
    // A real app would get user info from auth
    const userName = "User"; 
    return (
      <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {userName.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="h-8 w-8 bg-background">
      {assistantAvatar ? (
         <div className="relative h-8 w-8">
            <Image 
              src={assistantAvatar.imageUrl} 
              alt={assistantAvatar.description}
              data-ai-hint={assistantAvatar.imageHint}
              fill
              className="rounded-full object-cover"
            />
          </div>
      ) : (
        <AvatarFallback>
            <WisdomAI className="h-5 w-5 text-primary" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
