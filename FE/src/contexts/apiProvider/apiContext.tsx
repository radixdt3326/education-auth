
import { createContext, useContext } from "react";

// Define the type for the API context
export type ApiContextType = (...args: any) => Promise<any>;

const ApiContext = createContext<ApiContextType | null>(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export default ApiContext;
