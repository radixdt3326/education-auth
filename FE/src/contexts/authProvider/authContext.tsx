"use-client"
import { createContext, useContext } from "react";

export interface AuthContextType {
  myUserDetails: any;
  lastError: any;
  attemptAuth: (email: string, password: string) => void;
  attemptReauth: () => void;
  logout: (cb:()=>void) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
