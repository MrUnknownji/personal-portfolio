import { createContext, useContext } from "react";
import Lenis from "lenis";

interface LenisContextType {
  lenis: Lenis | null;
}

export const LenisContext = createContext<LenisContextType>({ lenis: null });

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    console.warn(
      "useLenis must be used within a LenisProvider. " +
        "Scroll stopping during transitions might not work.",
    );
  }
  return context;
};
