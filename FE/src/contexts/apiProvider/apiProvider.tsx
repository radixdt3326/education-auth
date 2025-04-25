"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import ApiContext from "./apiContext";
import api  from "../../utils/api";
import { useAuth } from "../authProvider/authContext";  // Using the updated AuthContext
import { ApiProviderProps, AuthContextType, requestBody } from "@/types/type";

const AUTH_RETRY_INTERVAL_MS = 60000;



type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const { myUserDetails, attemptReauth } : Pick<AuthContextType, 'attemptReauth' | 'myUserDetails' >  = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (myUserDetails) {
      doReauthTimeout();
    }
  }, [myUserDetails]);

  const doReauthTimeout = () :void => {
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
    }
    if (myUserDetails) {
      authTimeoutRef.current = setTimeout(() => {
        attemptReauth();
        doReauthTimeout();
      }, AUTH_RETRY_INTERVAL_MS);
    }
  };



  const apiWrapper = (method: ApiMethod, endpoint: string, data?: requestBody) => {
    return new Promise((resolve, reject) => {
      api(method, endpoint, data)
        .then(resolve)
        .catch((err:Error) => {

          localStorage.removeItem("sessId");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          window.location.href = "/";
          reject(err);
        });
    });
  };

  return (
    <ApiContext.Provider value={apiWrapper}>
      {children}
    </ApiContext.Provider>
  );
};
