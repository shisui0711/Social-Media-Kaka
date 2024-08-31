"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useToast } from "@/components/ui/use-toast";
import { useAuthorization } from "./AuthorizationProvider";
import { InfiniteData, QueryKey, useQueryClient } from "@tanstack/react-query";
import {
  CommentDto,
  ConversationDto,
  MessageDto,
  PaginatedListOfUserDto,
  UserDto,
} from "@/app/web-api-client";


import { BASE_API_URL } from "@/app/app.config";

// Define the shape of the context
interface SignalRContextType {
  connection: signalR.HubConnection | null;
  sendMessage: (message: MessageDto) => Promise<void>;
  sendNotification: (receiverId: string, message: string) => Promise<void>;
  sendFriendRequest: (userId: string) => Promise<void>;
  sendCancelFriend: (userId: string) => Promise<void>;
  sendComment: (comment: CommentDto, postId: string) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  checkStatus: (userId: string) => Promise<boolean>;
  createConversation: (conversation: ConversationDto) => Promise<void>;
}

interface CallProps {
  isRecevingCall: boolean;
  callerId: string;
  callerName: string;
  signalData: any;
}

// Create the context with default values
const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  sendMessage: async () => {},
  sendComment: async () => {},
  sendFriendRequest: async () => {},
  sendCancelFriend: async () => {},
  sendNotification: async () => {},
  joinGroup: async () => {},
  leaveGroup: async () => {},
  checkStatus: async () => false,
  createConversation: async () => {},
});

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //declare for standard
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const { toast } = useToast();
  const { token, user } = useAuthorization();
  const queryClient = useQueryClient();

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_API_URL}/project-hub`, {
        logger: signalR.LogLevel.Critical,
        accessTokenFactory: () => `${token}`,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected");
        newConnection
          .invoke("RegisterUserId", user.id)
          .catch((err) => console.error("Error registering userId:", err));
        setConnection(newConnection);
      })
      .catch((err) => {});

    //set up for standard
    newConnection.on("ReceiveNotification", (userId, message) => {
      const queryKey: QueryKey = ["notifications"];
      const queryKeySecond: QueryKey = ["unseen-notifications"];
      queryClient.refetchQueries({ queryKey });
      queryClient.refetchQueries({ queryKey: queryKeySecond });
      toast({
        title: "Thông báo",
        description: message,
        className:
          "bg-primary text-white bottom-0 left-0 flex fixed md:max-w-[300px] md:bottom-4 md:left-4",
      });
    });

    newConnection.on("ReceiveFriendRequest", async (user: UserDto) => {
      const queryKey: QueryKey = ["friend-suggestion"];
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<UserDto[]>(queryKey);
      queryClient.setQueryData<UserDto[]>(queryKey, () =>
        previousState?.filter((x) => x.id !== user.id)
      );
      queryClient.setQueriesData<InfiniteData<
        PaginatedListOfUserDto,
        string
      > | null>({ queryKey: ["friends-received"] }, (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage && firstPage.items) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                items: [user, ...firstPage.items],
                pageNumber: firstPage.pageNumber,
                totalPages: firstPage.totalPages,
                totalCount: firstPage.totalCount + 1,
                hasNextPage: firstPage.hasNextPage,
                hasPreviousPage: firstPage.hasPreviousPage,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });
    });

    newConnection.on("ReceiveCancelFriend", async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["friend-all"] });
      queryClient.setQueriesData<InfiniteData<
        PaginatedListOfUserDto,
        string
      > | null>({ queryKey: ["friends-all"] }, (oldData) => {
        if (!oldData) return;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            pageNumber: page.pageNumber,
            items: page.items.filter((user) => user.id !== userId),
            hasNextPage: page.hasNextPage,
            hasPreviousPage: page.hasPreviousPage,
            totalCount: page.totalCount - 1,
            totalPages: page.totalPages,
          })),
        };
      });
      await queryClient.cancelQueries({ queryKey: ["friends-received"] });
      queryClient.setQueriesData<InfiniteData<
        PaginatedListOfUserDto,
        string
      > | null>({ queryKey: ["friends-received"] }, (oldData) => {
        if (!oldData) return;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            pageNumber: page.pageNumber,
            items: page.items.filter((user) => user.id !== userId),
            hasNextPage: page.hasNextPage,
            hasPreviousPage: page.hasPreviousPage,
            totalCount: page.totalCount - 1,
            totalPages: page.totalPages,
          })),
        };
      });
      await queryClient.cancelQueries({ queryKey: ["friends-sended"] });
      queryClient.setQueriesData<InfiniteData<
        PaginatedListOfUserDto,
        string
      > | null>({ queryKey: ["friends-sended"] }, (oldData) => {
        if (!oldData) return;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            pageNumber: page.pageNumber,
            items: page.items.filter((user) => user.id !== userId),
            hasNextPage: page.hasNextPage,
            hasPreviousPage: page.hasPreviousPage,
            totalCount: page.totalCount - 1,
            totalPages: page.totalPages,
          })),
        };
      });
    });

    return () => {
      newConnection.stop();
    };
  }, [queryClient, toast, token, user.id]);

  //Method standard
  const sendMessage = async (message: MessageDto) => {
    if (connection) {
      try {
        await connection.invoke("SendMessage", message);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const sendFriendRequest = async (userId: string) => {
    if (connection) {
      try {
        await connection.invoke("SendFriendRequest", userId);
      } catch (error) {
        console.error("Error sending friend request:", error);
      }
    }
  };

  const sendCancelFriend = async (userId: string) => {
    if (connection) {
      try {
        await connection.invoke("SendCancelFriend", userId);
      } catch (error) {
        console.error("Error sending cancel friend request:", error);
      }
    }
  };

  const sendComment = async (comment: CommentDto, postId: string) => {
    if (connection) {
      try {
        await connection.invoke("SendComment", comment, postId);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const createConversation = async (conversation: ConversationDto) => {
    if (connection) {
      try {
        await connection.invoke("CreateConversation", conversation);
      } catch (err) {
        console.error("Error creating conversation:", err);
      }
    }
  };

  const joinGroup = async (groupId: string) => {
    if (connection) {
      try {
        console.log(`Join group:${groupId}`);
        await connection.invoke("JoinGroup", groupId);
      } catch (err) {
        console.error("Error joining group:", err);
      }
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (connection) {
      try {
        await connection.invoke("LeaveGroup", groupId);
      } catch (err) {
        console.error("Error leaving group:", err);
      }
    }
  };

  const checkStatus = async (userId: string) => {
    if (connection) {
      const status: boolean = await connection
        .invoke("IsUserConnected", userId)
        .catch((err) =>
          console.error("Error checking user connection status:", err)
        );
      return status;
    }
    return false;
  };

  const sendNotification = async (receiverId: string, message: string) => {
    if (connection) {
      try {
        await connection.invoke("SendNotification", receiverId, message);
      } catch (err) {
        console.error("Error sending notication:", err);
      }
    }
  };

  if (!token) return null;
  return (
    <SignalRContext.Provider
      value={{
        connection,
        sendMessage,
        sendComment,
        sendFriendRequest,
        sendCancelFriend,
        sendNotification,
        checkStatus,
        joinGroup,
        leaveGroup,
        createConversation
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

// Custom hook to use the SignalR context
export const useSignalR = () => {
  return useContext(SignalRContext);
};
