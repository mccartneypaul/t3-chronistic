import { StorePosition } from "./position";
import { createStore } from "zustand/vanilla";
import { Duration } from "dayjs/plugin/duration";
import dayjs from "dayjs";
import { devtools } from "zustand/middleware";

export interface PositionProps {
  positions: StorePosition[];
  timelinePosition: Duration;
}

export interface PositionState extends PositionProps {
  setPositions: (positions: StorePosition[]) => void;
  setPosition: (id: string, position: Partial<StorePosition>) => void;
  addPosition: (position: StorePosition) => void;
  removePosition: (id: string) => void;
  removePositionsForConstruct: (constructId: string) => void;
  updatePosition: (position: StorePosition) => void;
  upsertPosition: (position: StorePosition) => void;
  setTimelinePosition: (position: Duration) => void;
}

export type PositionStore = ReturnType<typeof createPositionStore>;

export const createPositionStore = (initState?: Partial<PositionState>) => {
  const DEFAULT_PROPS: PositionProps = {
    positions: [],
    timelinePosition: dayjs.duration(0),
  };
  return createStore<PositionState>()(
    devtools((set) => ({
      ...DEFAULT_PROPS,
      ...initState,
      setPositions: (newPositions: StorePosition[]) =>
        set(() => ({
          positions: newPositions,
        })),
      setPosition: (id: string, newPosition: Partial<StorePosition>) =>
        set((state) => ({
          positions: state.positions.map((position) =>
            position.id === id ? { ...position, ...newPosition } : position,
          ),
        })),
      addPosition: (newPosition: StorePosition) =>
        set((state) => ({
          positions: [...state.positions, newPosition],
        })),
      updatePosition: (updatedPosition: StorePosition) =>
        set((state) => ({
          positions: state.positions.map((position) =>
            position.id === updatedPosition.id
              ? { ...position, ...updatedPosition }
              : position,
          ),
        })),
      upsertPosition: (newPosition: StorePosition) =>
        set((state) => {
          const found = state.positions.some(
            (position) =>
              position.mapId === newPosition.mapId &&
              position.constructId === newPosition.constructId &&
              position.intervalFromBeginning
                .subtract(newPosition.intervalFromBeginning)
                .asSeconds() === 0,
          );

          return {
            positions: found
              ? state.positions.map((position) =>
                  position.mapId === newPosition.mapId &&
                  position.constructId === newPosition.constructId &&
                  position.intervalFromBeginning
                    .subtract(newPosition.intervalFromBeginning)
                    .asSeconds() === 0
                    ? { ...position, ...newPosition }
                    : position,
                )
              : [...state.positions, newPosition],
          };
        }),
      removePosition: (id: string) =>
        set((state) => ({
          positions: state.positions.filter((position) => position.id !== id),
        })),
      removePositionsForConstruct: (constructId: string) =>
        set((state) => ({
          positions: state.positions.filter(
            (position) => position.constructId !== constructId,
          ),
        })),
      setTimelinePosition: (newPosition: Duration) =>
        set(() => ({
          timelinePosition: newPosition,
        })),
    })),
  );
};
