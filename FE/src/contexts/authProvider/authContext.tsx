"use-client"
import { AuthContextType } from "@/types/type";
import { createContext, useContext } from "react";



export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () : AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
