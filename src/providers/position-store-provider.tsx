"use client";

import { createContext, useRef, useContext } from "react";
import type { ReactNode } from "react";
import { useStore } from "zustand";

import {
  type PositionState,
  type PositionStore,
  createPositionStore,
} from "../stores/position-store";

export const PositionStoreContext = createContext<PositionStore | null>(null);

export interface PositionStoreProviderProps {
  children: ReactNode;
}

export const PositionStoreProvider = ({
  children,
}: PositionStoreProviderProps) => {
  const storeRef = useRef<PositionStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createPositionStore();
  }
  return (
    <PositionStoreContext.Provider value={storeRef.current}>
      {children}
    </PositionStoreContext.Provider>
  );
};

export const usePositionContext = <T,>(
  selector: (state: PositionState) => T,
): T => {
  const positionStoreContext = useContext(PositionStoreContext);

  if (!positionStoreContext) {
    throw new Error(
      `usePositionStore must be used within PositionStoreProvider`,
    );
  }

  return useStore(positionStoreContext, selector);
};
