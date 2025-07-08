import type { BoundingBox } from "./BoundingBox";
import type { ViewTransformation } from "./ViewTransformation";
import { Duration } from "dayjs/plugin/duration";
import { StorePosition } from "@chronistic/stores/position";

export interface Position {
  posX: number;
  posY: number;
}

export function translatePositionForTimeline(
  timelinePosition: Duration,
  constructPositions: StorePosition[],
): Position | undefined {
  // Find the positions that are immediately before and after the timeline position
  const before = constructPositions
    .filter((p) => p.intervalFromBeginning <= timelinePosition)
    .sort((a, b) =>
      b.intervalFromBeginning.subtract(a.intervalFromBeginning).asSeconds(),
    )[0];

  // If there are positions after but not before, return undefined.
  if (!before) {
    return undefined;
  }

  const after = constructPositions
    .filter((p) => p.intervalFromBeginning > timelinePosition)
    .sort((a, b) =>
      a.intervalFromBeginning.subtract(b.intervalFromBeginning).asSeconds(),
    )[0];

  // If there is no position after then we assume that the construct is at the position before.
  if (!after) {
    return {
      posX: before.posX,
      posY: before.posY,
    };
  }

  // If there is a position after, we need to interpolate between the two positions.
  // Calculate the ratio of the timeline position between the two positions

  /*
    Interpolating between two positions on a timeline:

    before (t0, x0, y0)         timelinePosition (t, x, y)         after (t1, x1, y1)
           |--------------------------|--------------------------|
          t0                         t                         t1

    The ratio is:
      ratio = (t - t0) / (t1 - t0)

    Interpolated position:
      x = x0 + (x1 - x0) * ratio
      y = y0 + (y1 - y0) * ratio
  */
  const ratio =
    timelinePosition.subtract(before.intervalFromBeginning).asSeconds() /
    after.intervalFromBeginning
      .subtract(before.intervalFromBeginning)
      .asSeconds();

  const interpolatedX = before.posX + (after.posX - before.posX) * ratio;
  const interpolatedY = before.posY + (after.posY - before.posY) * ratio;
  return {
    posX: interpolatedX,
    posY: interpolatedY,
  };
}

export function translatePositionForView(
  boundingBox: BoundingBox,
  viewTransformation: ViewTransformation,
  position: Position | undefined,
): Position {
  const centerX = boundingBox.width / 2;
  const centerY = boundingBox.top + boundingBox.height / 2;

  // Calculate the position of the construct relative to the center
  const relativeX = (position?.posX ?? 0) - centerX;
  const relativeY = (position?.posY ?? 0) - centerY;

  // Scale the relative position
  const scaledX = (relativeX * viewTransformation.scale) / 100;
  const scaledY = (relativeY * viewTransformation.scale) / 100;

  // Calculate the new position of the construct
  const newPosX =
    scaledX +
    centerX +
    (viewTransformation.translateX * viewTransformation.scale) / 100;
  const newPosY =
    scaledY +
    centerY +
    (viewTransformation.translateY * viewTransformation.scale) / 100;

  return {
    posX: newPosX,
    posY: newPosY,
  };
}

export function translatePositionForStore(
  boundingBox: BoundingBox,
  viewTransformation: ViewTransformation,
  position: Position | undefined,
): Position {
  const centerX = boundingBox.width / 2;
  const centerY = boundingBox.top + boundingBox.height / 2;

  // Translate the construct's position back to the center
  const translatedX =
    (position?.posX ?? 0) -
    centerX -
    (viewTransformation.translateX * viewTransformation.scale) / 100;
  const translatedY =
    (position?.posY ?? 0) -
    centerY -
    (viewTransformation.translateY * viewTransformation.scale) / 100;

  // Reverse the scaling transformation
  const originalX = translatedX / (viewTransformation.scale / 100);
  const originalY = translatedY / (viewTransformation.scale / 100);

  // Calculate the original position of the construct
  const originalPosX = originalX + centerX;
  const originalPosY = originalY + centerY;

  return {
    posX: originalPosX,
    posY: originalPosY,
  };
}
