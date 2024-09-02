export interface BoundingBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export const initBoundingBox: BoundingBox = { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 };