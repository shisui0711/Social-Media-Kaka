import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SmilePlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

interface Props {
  className?: string;
  onEmojiClick?: (emoji: string) => void;
}

const EmojiDropdown = ({ className,onEmojiClick }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}><SmilePlus className="text-yellow-500"/></DropdownMenuTrigger>
      <DropdownMenuContent>
        <EmojiPicker onEmojiClick={(emoji) => {
          if(onEmojiClick){
            onEmojiClick(emoji.emoji)
          }
        }}/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmojiDropdown;
