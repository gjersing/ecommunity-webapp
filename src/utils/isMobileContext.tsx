import { useMediaQuery } from "@chakra-ui/react";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";

const IsMobileContext = createContext(false);

interface ChildProps {
  children?: ReactNode;
}

export const IsMobileContextProvider = ({ children }: ChildProps) => {
  const [isMobile, setIsMobile] = useState(false);

  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)", {
    ssr: true,
    fallback: false,
  });

  useEffect(() => {
    setIsMobile(isLargerThan1280);
  }, [isLargerThan1280]);

  return (
    <IsMobileContext.Provider value={isMobile}>
      {children}
    </IsMobileContext.Provider>
  );
};

export function useIsClient() {
  return useContext(IsMobileContext);
}
