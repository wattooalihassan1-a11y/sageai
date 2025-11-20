import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { SageAI } from "./icons";

type Props = {
  message: ChatMessage;
};

export function ChatAvatar({ message }: Props) {
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
    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
      <AvatarFallback>
        <SageAI className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );
}
