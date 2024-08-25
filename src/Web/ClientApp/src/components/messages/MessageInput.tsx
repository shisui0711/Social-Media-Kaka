'use client'

import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSendMessageMutation } from "./mutations";
import { ConversationDto } from "@/app/web-api-client";

interface MessageInputProps {
  senderId:string,
  receiverId:string,
  conversation?: ConversationDto
}

export default function MessageInput({senderId,receiverId,conversation}:MessageInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSendMessageMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        conversation,
        message: input,
        receiverId,
        senderId
      },
      {
        onSuccess: () => setInput(""),
      },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Viết tin nhắn..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim()}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}