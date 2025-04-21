"use client";
import {ReactNode} from 'react'
import { AuthProvider } from './authProvider/authProvide'
import { ApiProvider } from './apiProvider/apiProvider'

interface AuthProviderProps {
    children: ReactNode;
  }

export function Providers({ children } : AuthProviderProps) {
    return (

        <AuthProvider>
            <ApiProvider>
                {children}
            </ApiProvider>
        </AuthProvider>
    );
}