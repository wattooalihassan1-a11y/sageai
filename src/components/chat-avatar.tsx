import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatMessage } from "@/lib/types";
import { WisdomAI } from "./icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

type Props = {
  message: ChatMessage;
};

export function ChatAvatar({ message }: Props) {
  const assistantAvatar = PlaceHolderImages.find(p => p.id === 'sage-ai-logo');

  if (message.role === "user") {
    // A real app would get user info from auth
    const userName = "User"; 
    return (
      <Avatar>
        <AvatarFallback>
          {userName.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar>
      {assistantAvatar ? (
         <div className="relative h-10 w-10">
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
            <WisdomAI className="h-6 w-6 text-primary" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
