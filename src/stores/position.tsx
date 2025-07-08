import { Duration } from "dayjs/plugin/duration";
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
  // For some reason, the API returns an array of positions, so we take the first one.
  let myPosition: ApiPosition;
  if (Array.isArray(apiPosition) && apiPosition.length > 0) {
    myPosition = apiPosition[0];
  } else {
    myPosition = apiPosition;
  }
  return {
    ...myPosition,
    intervalFromBeginning: dayjs.duration(myPosition.intervalFromBeginning),
  };
}

export function mapToApi(storePosition: StorePosition): ApiPosition {
  return {
    ...storePosition,
    intervalFromBeginning: storePosition.intervalFromBeginning.toISOString(),
  };
}
