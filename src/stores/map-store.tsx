import { mapFromApi, StoreMap } from "./map";
import { createStore } from "zustand/vanilla";

export interface MapProps {
  maps: StoreMap[];
}

export interface MapState extends MapProps {
  setMaps: (maps: Partial<StoreMap[]>) => void;
  addMap: (map: StoreMap) => void;
  removeMap: (id: string) => void;
}

export type MapStore = ReturnType<typeof createMapStore>;

export const createMapStore = (initState?: Partial<MapState>) => {
  const DEFAULT_PROPS: MapProps = {
    maps: [],
  };
  return createStore<MapState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initState,
    setMaps: (newMaps: Partial<StoreMap[]>) =>
      set(() => ({
        maps: newMaps
          .filter((map) => map != undefined)
          .map((map) => mapFromApi(map)),
      })),
    addMap: (newMap: StoreMap) =>
      set((state) => ({
        maps: [...state.maps, newMap],
      })),
    removeMap: (id: string) =>
      set((state) => ({
        maps: state.maps.filter((map) => map.id !== id),
      })),
  }));
};
