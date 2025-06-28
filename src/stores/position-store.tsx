import { mapFromApi, StorePosition } from "./position";
import { createStore } from "zustand/vanilla";
import duration, { Duration } from "dayjs/plugin/duration";
import dayjs from "dayjs";

export interface PositionProps {
  positions: StorePosition[];
  timelinePosition: Duration;
}

export interface PositionState extends PositionProps {
  setPositions: (positions: Partial<StorePosition[]>) => void;
  addPosition: (position: StorePosition) => void;
  removePosition: (id: string) => void;
  setTimelinePosition: (position: Duration) => void;
}

export type PositionStore = ReturnType<typeof createPositionStore>;

export const createPositionStore = (initState?: Partial<PositionState>) => {
  dayjs.extend(duration);
  const DEFAULT_PROPS: PositionProps = {
    positions: [],
    timelinePosition: dayjs.duration(0),
  };
  return createStore<PositionState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initState,
    setPositions: (newPositions: Partial<StorePosition[]>) =>
      set(() => ({
        positions: newPositions.filter((position) => position != undefined),
      })),
    addPosition: (newPosition: StorePosition) =>
      set((state) => ({
        positions: [...state.positions, newPosition],
      })),
    removePosition: (id: string) =>
      set((state) => ({
        positions: state.positions.filter((position) => position.id !== id),
      })),
    setTimelinePosition: (newPosition: Duration) =>
      set(() => ({
        timelinePosition: newPosition,
      })),
  }));
};
