import duration, { Duration } from "dayjs/plugin/duration";
import dayjs from "dayjs";

export interface BasePosition {
  id: string;
  mapId: string;
  constructId: string;
  posX: number;
  posY: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorePosition extends BasePosition {
  intervalFromBeginning: Duration;
}

export interface ApiPosition extends BasePosition {
  intervalFromBeginning: string;
}

export function mapFromApi(apiPosition: ApiPosition): StorePosition {
  dayjs.extend(duration);
  return {
    ...apiPosition,
    intervalFromBeginning: dayjs.duration(apiPosition.intervalFromBeginning),
  };
}

export function mapToApi(storePosition: StorePosition): ApiPosition {
  dayjs.extend(duration);
  return {
    ...storePosition,
    intervalFromBeginning: storePosition.intervalFromBeginning.toISOString(),
  };
}
