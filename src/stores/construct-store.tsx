import { createStore } from "zustand/vanilla";
import { mapFromApi, type StoreConstruct } from "./construct";
import { api } from "../utils/api";

export interface ConstructProps {
  activeMapId: string;
  constructs: StoreConstruct[];
}

export interface ConstructState extends ConstructProps {
  activeConstruct?: StoreConstruct;
  setConstruct: (id: string, construct: Partial<StoreConstruct>) => void;
  addConstruct: (construct: StoreConstruct) => void;
  removeConstruct: (id: string) => void;
  getConstructsForMap: (mapId: string) => StoreConstruct[];
  setActiveConstruct: (constructId: string) => void;
}

export type ConstructStore = ReturnType<typeof createConstructStore>;

export const initConstructStore = async (
  mapId: string
): Promise<ConstructProps> => {
  const query = api.construct.getByMap.useQuery(mapId);
  await query.refetch();
  return {
    activeMapId: mapId,
    constructs: query.data?.map((construct) => mapFromApi(construct)) ?? [],
  };
};

export const createConstructStore = (initState?: Partial<ConstructState>) => {
  const DEFAULT_PROPS: ConstructProps = {
    activeMapId: "",
    constructs: [],
  };
  return createStore<ConstructState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initState,
    setConstruct: (id: string, newConstruct: Partial<StoreConstruct>) =>
      set((state) => ({
        constructs: state.constructs.map((construct) =>
          construct.id === id ? { ...construct, ...newConstruct } : construct
        ),
      })),
    addConstruct: (newConstruct: StoreConstruct) =>
      set((state) => ({
        constructs: [...state.constructs, newConstruct],
      })),
    removeConstruct: (id: string) =>
      set((state) => ({
        constructs: state.constructs.filter((construct) => construct.id !== id),
      })),
    getConstructsForMap: (mapId: string): StoreConstruct[] => {
      const constructs =
        api.construct.getByMap
          .useQuery(mapId)
          .data?.map((construct) => mapFromApi(construct)) ?? [];
      set(() => ({ constructs }));
      return constructs;
    },
    setActiveConstruct: (constructId: string) =>
      set((state) => ({
        activeConstruct: state.constructs.find(
          (construct) => construct.id === constructId
        ),
      })),
  }));
};
