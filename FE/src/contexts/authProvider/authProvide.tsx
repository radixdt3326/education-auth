"use client";

import { useState, useEffect, ReactNode, JSX } from "react";
import { AuthContext } from "./authContext";
// import googleEvent from "./googleEvent";
import api from "../../utils/api";
import { ApiProviderProps } from "@/types/type";
import { jsx } from "react/jsx-runtime";
// import * as cacher from "./cacher";

const getUserIdent = (userDetails: any) => {
  return userDetails ? `${userDetails.email}//${userDetails.school}` : null;
};

export const AuthProvider = ({ children }: ApiProviderProps) : JSX.Element => {
  const [myUserDetails, setMyUserDetails] = useState<any>("");
  const [lastError, setLastError] = useState<any>(null);
  const [inited, setInited] = useState<boolean>(false);

  useEffect(() => {
    attemptReauth();
  }, []);

  const _doLocalLogout = () => {
    // cacher.clearAll();
    setMyUserDetails(null);
    setLastError(null);
    localStorage.removeItem("sessId");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setLastError(null);

  };

  const logout = (cb:()=>void) => {
    api("POST" , "auth/logout")
      .then(() => {
        cb();
        _doLocalLogout();
      })
      .catch(_doLocalLogout);
  };

  const attemptAuth = (email: string, password: string)=> {
    api( "POST" , "auth/signin", { email, password })
      .then((result: any) => {
        // cacher.clearAll();
        // googleEvent("login", null, null, null, result.oid);
        setMyUserDetails(result);
        localStorage.setItem('sessId', result.sessionToken);
        localStorage.setItem('userId', result.userID);
        localStorage.setItem('role', result.userrole);
        setLastError(null);
      })
      .catch((err: Error) => {
        // cacher.clearAll();
        setMyUserDetails(null);
        setLastError(err.message);
      });
  };

  const attemptReauth = () => {
    const oldUserIdent = getUserIdent(myUserDetails);
    if(myUserDetails){
      api("POST" , "auth/reauth" , myUserDetails )
      .then((result: any) => {
        if (oldUserIdent !== getUserIdent(result.data)) {
        //   cacher.clearAll();
        }
        localStorage.setItem('sessId', result.sessionToken);
        localStorage.setItem('userId', result.userID);
        localStorage.setItem('role', result.userrole);
        setMyUserDetails(result);
        setLastError(null)
        setInited(true);
      })
      .catch((err:Error ) => {
        if (oldUserIdent !== getUserIdent(null)) {
        //   cacher.clearAll();
        }
        setMyUserDetails(null);
        setInited(true);
        setLastError(err.message);
      });
    }else{
      setInited(true);
    }

  };

  if (!inited) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        myUserDetails,
        lastError,
        attemptAuth,
        attemptReauth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
