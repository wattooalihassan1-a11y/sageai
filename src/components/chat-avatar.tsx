import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
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
    return (
      <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground">
        <AvatarFallback>
          <User className="h-5 w-5" />
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
