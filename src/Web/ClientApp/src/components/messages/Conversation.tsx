import UserAvatar from "@/components/UserAvatar";
import { calculateTimeDifference, cn } from "@/lib/utils";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { useSignalR } from "@/providers/SignalRProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ConversationMoreButton from "./ConversationMoreButton";
import { ConversationDto, MessageDto } from "@/app/web-api-client";
import { useQueries } from "@tanstack/react-query";
import { useApiClient } from "@/app/hooks/useApiClient";

type Props = {
  conversation: ConversationDto;
  selected?: boolean;
};

const ConversationComponent = ({ conversation, selected }: Props) => {
  const router = useRouter();
  const { connection } = useSignalR();
  const client = useApiClient();
  const [lastMessage, setLastMessage] = useState<MessageDto | undefined>(
    !!conversation?.messages?.length ? conversation.messages[0] : undefined
  );

  if (!conversation.conversationMembers || !conversation.messages) {
    throw new Error("Conversation is not valid");
  }

  const results = useQueries({
    queries: conversation.conversationMembers.map((item) => ({
      queryKey: ["user-info", item.userId],
      queryFn: () => client.getUserInfoById(item.userId),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60, //1 hours
    })),
  });

  useEffect(() => {
    if (connection) {
      const handleLastMessage = (message: MessageDto) => {
        if (message.conversationId == conversation.id) {
          setLastMessage(message);
        }
      };
      connection.on("ReceiveMessage", handleLastMessage);
      return () => {
        connection.off("ReceiveMessage", handleLastMessage);
      };
    }
  }, [connection, conversation.id, lastMessage]);

  return (
    <section
      hidden={lastMessage === undefined}
      className={cn(
        `relative bg-background rounded-2xl p-2 flex items-center gap-2 cursor-pointer group/conversation`
      )}
      onClick={() => {
        router.push(`/messages/${conversation.id}`);
      }}
    >
      {conversation.conversationMembers.length > 2 ? (
        <UserAvatar />
      ) : (
        <UserAvatar avatarUrl={results[0].data?.avatarUrl} />
      )}
      <div className="sm:flex flex-col gap-1 w-full justify-center hidden">
        <h1 className="text-sm font-semibold line-clamp-1">
          {conversation.conversationMembers.length > 2
            ? results.map((item) => item.data?.displayName).join(",")
            : results[0].data?.displayName}
        </h1>
        {lastMessage && (
          <div className="flex text-xs gap-2 justify-between">
            <p className="line-clamp-1">{lastMessage.content}</p>
            <p className="text-nowrap border-primary border-1 px-1 rounded-2xl bg-blue-300 dark:bg-primary">
              {calculateTimeDifference(lastMessage.created)}
            </p>
          </div>
        )}
      </div>
      <ConversationMoreButton
        conversation={conversation}
        className={`z-10 absolute right-2 top-[50%] translate-y-[-50%] bg-card p-1 rounded-full hidden md:group-hover/conversation:block`}
      />
    </section>
  );
};

export default ConversationComponent;
