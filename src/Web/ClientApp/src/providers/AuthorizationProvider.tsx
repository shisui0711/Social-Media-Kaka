"use client"
import { MyUserDto } from "@/app/web-api-client";
import React, { createContext, useContext, useState } from "react";

interface IAuthorizationContext {
  user: MyUserDto;
  token: string
}

interface IAuthorizationProviderProps {
  user: MyUserDto;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const AuthorizationContext = createContext<IAuthorizationProviderProps|null>(null)

const AuthorizationProvider = ({ children, value: { user , token : originToken} }: React.PropsWithChildren<{ value: IAuthorizationContext }>) => {
  const [token, setToken] = useState(originToken)
  return (
    <AuthorizationContext.Provider value={{user, token, setToken}}>
      {children}
    </AuthorizationContext.Provider>
  )
}

export default AuthorizationProvider

export function useAuthorization() {
  const context = useContext(AuthorizationContext)
  if (!context) {
    throw new Error("useAuthorization must be used within a AuthorizationProvider")
  
  }
  return context
}