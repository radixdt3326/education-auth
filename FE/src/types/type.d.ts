export interface ErrorObject {
    email : string;
    password : string;
    message : string;
  }
  
 export interface SignInState {
    email : string;
    password : string;
    loading : boolean;
  }
  
  export enum UserRole {
    User = "user",
    Admin = "admin",
  }

  export interface ApiProviderProps {
    children: ReactNode;
  }

  export interface myUserDetails {
    useremail : string;
    password : string;
    name : string;
  }

  export interface AuthContextType {
    myUserDetails: myUserDetails;
    lastError: string;
    attemptAuth: (email: string, password: string) => void;
    attemptReauth: () => void;
    logout: (cb:()=>void) => void;
  }

  export interface requestBody{
	email : string
	password : string
}