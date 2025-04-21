"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import ApiContext, { useApi } from "./apiContext";
import api from "../../utils/api";
import { useAuth } from "../authProvider/authContext";  // Using the updated AuthContext

const AUTH_RETRY_INTERVAL_MS = 60000;

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const { myUserDetails, attemptReauth } = useAuth();
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

  const doReauthTimeout = () => {
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

  const apiWrapper = (...args: any[]) => {
    return new Promise((resolve, reject) => {
      api(...args)
        .then(resolve)
        .catch((err) => {

          if (err === "_ERROR_ :: cannot copy" && isMounted) {
            // doReauthTimeout();
            // attemptReauth();
          }  // based on need


          localStorage.removeItem("sessId");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          window.location = "/";
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
