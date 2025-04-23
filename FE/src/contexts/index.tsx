"use client";
import {ReactNode} from 'react'
import { AuthProvider } from './authProvider/authProvide'
import { ApiProvider } from './apiProvider/apiProvider'
import { ApiProviderProps } from '@/types/type';


export function Providers({ children } : ApiProviderProps) {
    return (

        <AuthProvider>
            <ApiProvider>
                {children}
            </ApiProvider>
        </AuthProvider>
    );
}