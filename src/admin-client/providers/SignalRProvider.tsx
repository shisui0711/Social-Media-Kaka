/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuthorization } from "./AuthorizationProvider";



// Define the shape of the context
interface SignalRContextType {
  connection: signalR.HubConnection | null
}



// Create the context with default values
const SignalRContext = createContext<SignalRContextType>({
  connection: null
});

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //declare for standard
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const { token, user } = useAuthorization();

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BASE_API_URL}/project-hub`, {
        logger: signalR.LogLevel.Critical,
        accessTokenFactory: () => `${token}`,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected");
        setConnection(newConnection);
      })
      .catch(() => {});
    return () => {
      newConnection.stop();
    };
  }, [token, user.id]);

  if (!token) return null;
  return (
    <SignalRContext.Provider
      value={{
        connection,
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
