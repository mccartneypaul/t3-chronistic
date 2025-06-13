"use client";

import { createContext, useRef, useContext } from "react";
import type { ReactNode } from "react";
import { useStore } from "zustand";

import {
  type MapState,
  type MapStore,
  createMapStore,
} from "../stores/map-store";

// export type MapStoreApi = ReturnType<typeof createMapStore>

export const MapStoreContext = createContext<MapStore | null>(null);

export interface MapStoreProviderProps {
  children: ReactNode;
}
// type MapStoreProviderProps = React.PropsWithChildren<MapProps>;

export const MapStoreProvider = ({
  children,
}: MapStoreProviderProps) => {
  const storeRef = useRef<MapStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createMapStore();
  }
  return (
    <MapStoreContext.Provider value={storeRef.current}>
      {children}
    </MapStoreContext.Provider>
  );
};

export const useMapContext = <T,>(
  selector: (state: MapState) => T,
): T => {
  const mapStoreContext = useContext(MapStoreContext);

  if (!mapStoreContext) {
    throw new Error(
      `useMapStore must be used within MapStoreProvider`,
    );
  }

  return useStore(mapStoreContext, selector);
};
