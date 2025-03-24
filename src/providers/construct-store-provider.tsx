"use client";

import { createContext, useRef, useContext } from "react";
import type { ReactNode } from "react";
import { useStore } from "zustand";

import {
  type ConstructState,
  type ConstructStore,
  createConstructStore,
} from "../stores/construct-store";

// export type ConstructStoreApi = ReturnType<typeof createConstructStore>

export const ConstructStoreContext = createContext<ConstructStore | null>(null);

export interface ConstructStoreProviderProps {
  children: ReactNode;
}
// type ConstructStoreProviderProps = React.PropsWithChildren<ConstructProps>;

export const ConstructStoreProvider = ({
  children,
}: ConstructStoreProviderProps) => {
  const storeRef = useRef<ConstructStore>();
  if (!storeRef.current) {
    storeRef.current = createConstructStore();
  }
  return (
    <ConstructStoreContext.Provider value={storeRef.current}>
      {children}
    </ConstructStoreContext.Provider>
  );
};

export const useConstructContext = <T,>(
  selector: (state: ConstructState) => T
): T => {
  const constructStoreContext = useContext(ConstructStoreContext);

  if (!constructStoreContext) {
    throw new Error(
      `useConstructStore must be used within ConstructStoreProvider`
    );
  }

  return useStore(constructStoreContext, selector);
};
