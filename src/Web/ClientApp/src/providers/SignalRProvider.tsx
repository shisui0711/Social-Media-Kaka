"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useToast } from "@/components/ui/use-toast";
import { useAuthorization } from "./AuthorizationProvider";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { ConversationDto, MessageDto } from "@/app/web-api-client";
import { BASE_API_URL } from "@/app/app.config";

// Define the shape of the context
interface SignalRContextType {
  connection: signalR.HubConnection | null;
  sendMessage: (message: MessageDto) => Promise<void>;
  sendNotification: (receiverId: string, message: string) => Promise<void>;
  sendComment: (comment: Comment, postId:string) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  checkStatus: (userId: string) => Promise<boolean>;
  createConversation: (conversation:ConversationDto) => Promise<void>;
}

// Create the context with default values
const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  sendMessage: async () => {},
  sendComment: async () => {},
  sendNotification: async () => {},
  joinGroup: async () => {},
  leaveGroup: async () => {},
  checkStatus: async () => false,
  createConversation: async () => {},
});

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const { toast } = useToast();
  const [userStatus, setUserStatus] = useState(false);
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

    newConnection.on("ReceiveNotification", (userId, message) => {
      const queryKey: QueryKey = ["notifications"];
          const queryKeySecond: QueryKey = ["unseen-notifications"];
          queryClient.refetchQueries({queryKey});
          queryClient.refetchQueries({queryKey:queryKeySecond})
      toast({
        title: "Thông báo",
        description: message,
        className:
          "bg-primary text-white bottom-0 left-0 flex fixed md:max-w-[300px] md:bottom-4 md:left-4",
      });
    });

    return () => {
      setUserStatus(false);
      newConnection.stop();
    };
  }, [queryClient, toast, token, user.id]);

  const sendMessage = async (message: MessageDto) => {
    if (connection) {
      try {
        await connection.invoke("SendMessage", message);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const sendComment = async (comment: Comment, postId:string) =>{
    if(connection){
      try {
        await connection.invoke("SendComment", comment, postId);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  }

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
        console.log(`Join group:${groupId}`)
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
