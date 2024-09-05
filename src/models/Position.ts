import type { BoundingBox } from "./BoundingBox";
import type { ViewTransformation } from "./ViewTransformation";

export interface Position {
  posX: number;
  posY: number;
}

export function translatePositionForView(boundingBox: BoundingBox, viewTransformation: ViewTransformation, position: Position | undefined): Position {
  const centerX = boundingBox.width / 2;
  const centerY = boundingBox.top + (boundingBox.height / 2);

  // Calculate the position of the construct relative to the center
  const relativeX = (position?.posX ?? 0) - centerX;
  const relativeY = (position?.posY ?? 0) - centerY;

  // Scale the relative position
  const scaledX = relativeX * viewTransformation.scale/100;
  const scaledY = relativeY * viewTransformation.scale/100;

  // Calculate the new position of the construct
  const newPosX = scaledX + centerX + viewTransformation.translateX * viewTransformation.scale/100;
  const newPosY = scaledY + centerY + viewTransformation.translateY * viewTransformation.scale/100;

  return {
    posX: newPosX,
    posY: newPosY,
  };
}

export function translatePositionForStore(boundingBox: BoundingBox, viewTransformation: ViewTransformation, position: Position | undefined): Position {
  const centerX = boundingBox.width / 2;
  const centerY = boundingBox.top + (boundingBox.height / 2);

  // Translate the construct's position back to the center
  const translatedX = (position?.posX ?? 0) - centerX - viewTransformation.translateX / viewTransformation.scale/100;
  const translatedY = (position?.posY ?? 0) - centerY - viewTransformation.translateY / viewTransformation.scale/100;

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