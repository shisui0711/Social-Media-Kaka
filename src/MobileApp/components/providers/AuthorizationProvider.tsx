import { MyUserDto } from "@/lib/api-client";
import React, { createContext, useContext } from "react";

const AuthorizationContext = createContext<MyUserDto | null>(null);

const AuthorizationProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: MyUserDto }>) => {
  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;

export function useUser() {
  const context = useContext(AuthorizationContext);
  if (!context) {
    throw new Error("useUser must be used within a AuthorizationProvider");
  }
  return context;
}
