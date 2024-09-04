import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";
import { useSignalR } from "@/providers/SignalRProvider";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { PostDto } from "@/app/web-api-client";
import EmojiDropdown from "../EmojiDropdown";


interface CommentInputProps {
  post: PostDto;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");
  const { sendNotification } = useSignalR();
  const { user: signInUser } = useAuthorization();

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: async () => {
          setInput("");
          if (post.userId !== signInUser.id)
            sendNotification(
              post.userId,
              `${signInUser.displayName} đã bình luận bài viết của bạn`
            );
        },
      }
    );
  }

  return (
    <form
      className="relative flex w-full items-center gap-2"
      onSubmit={onSubmit}
    >
      <EmojiDropdown className="absolute right-14" onEmojiClick={(emoji)=> setInput(prev=>prev.concat(emoji))} />
      <Input
        placeholder="Viết bình luận..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
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
