import UserAvatar from "@/components/UserAvatar";
import { calculateTimeDifference, cn } from "@/lib/utils";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { useSignalR } from "@/providers/SignalRProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ConversationMoreButton from "./ConversationMoreButton";
import { ConversationDto, MessageDto } from "@/app/web-api-client";

type Props = {
  conversation: ConversationDto;
  selected?: boolean;
};

const ConversationComponent = ({ conversation, selected }: Props) => {
  const { user } = useAuthorization();
  const router = useRouter();
  const { connection } = useSignalR();
  const [lastMessage, setLastMessage] = useState<MessageDto|undefined >(
    !!conversation?.messages?.length ? conversation.messages[0] : undefined
  );

  if(!conversation.conversationMembers || !conversation.messages){
    throw new Error("Conversation is not valid");
  }

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
    //TODO: add case for group chat
    <section
      hidden={lastMessage === undefined}
      className={cn(`relative bg-background rounded-2xl p-2 flex items-center gap-2 cursor-pointer group/conversation`,
      )}
      onClick={() => {
        router.push(`/messages/${conversation.id}`);
      }}
    >
      <UserAvatar
        avatarUrl={
          conversation.conversationMembers.filter((x) => x.userId != user.id)[0]
            .user?.avatarUrl
        }
      />
      <div className="sm:flex flex-col gap-1 w-full justify-center hidden">
        {conversation.conversationMembers.length > 2 ? (
          <></>
        ) : (
          <>
            <h1 className="font-semibold">
              {
                conversation?.conversationMembers.filter(
                  (x) => x.userId != user.id
                )[0].user?.displayName
              }
            </h1>
            {lastMessage && (
              <div className="flex text-xs gap-2">
                <p className="line-clamp-1">{lastMessage.content}</p>
                <p className="text-nowrap border-primary border-1 px-1 rounded-2xl bg-blue-300 dark:bg-primary">
                  {calculateTimeDifference(lastMessage.created)}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <ConversationMoreButton conversation={conversation}  className={`z-10 absolute right-2 top-[50%] translate-y-[-50%] bg-card p-1 rounded-full hidden group-hover/conversation:block`} />
    </section>
  );
};

export default ConversationComponent;
