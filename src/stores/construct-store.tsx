import { createStore } from 'zustand/vanilla'
import { mapFromApi, type StoreConstruct } from './construct'
import { api } from "../utils/api";

export interface ConstructProps {
  constructs: StoreConstruct[]
}

export interface ConstructState extends ConstructProps {
  activeConstruct?: StoreConstruct
  setConstruct: (id: string, construct: Partial<StoreConstruct>) => void,
  getConstructsForMap: (mapId: string) => StoreConstruct[],
  setActiveConstruct: (constructId: string) => void,
}

export type ConstructStore = ReturnType<typeof createConstructStore>

export const initConstructStore = async (mapId: string): Promise<ConstructProps> => {
  const query = api.construct.getByMap.useQuery(mapId);
  await query.refetch();
  return { 
    constructs: query.data?.map(construct => mapFromApi(construct)) ?? [],
  };
}

export const createConstructStore = (
  initState?: Partial<ConstructState>,
) => {
  const DEFAULT_PROPS: ConstructProps = {
    constructs: [],
  }
  return createStore<ConstructState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initState,
    setConstruct: (id: string, newConstruct: Partial<StoreConstruct>) => set((state) => ({
      constructs: state.constructs.map(construct =>
        construct.id === id ? { ...construct, ...newConstruct } : construct
      )
    })),
    getConstructsForMap: (mapId: string): StoreConstruct[] => {
      const constructs = api.construct.getByMap.useQuery(mapId).data?.map(construct => mapFromApi(construct)) ?? [];
      set(() => ({ constructs }));
      return constructs;
    },
    setActiveConstruct: (constructId: string) => set((state) => ({
      activeConstruct: state.constructs.find(construct => construct.id === constructId)
    }))
  }))
}
