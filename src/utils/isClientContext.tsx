import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";

const IsClientContext = createContext(false);

interface ChildProps {
  children?: ReactNode;
}

export const IsClientContextProvider = ({ children }: ChildProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log("evaluating server vs client location");
    setIsClient(true);
  }, []);

  return (
    <IsClientContext.Provider value={isClient}>
      {children}
    </IsClientContext.Provider>
  );
};

export function useIsClient() {
  return useContext(IsClientContext);
}
