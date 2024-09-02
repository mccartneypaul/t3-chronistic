import Image from "next/image";
import ConstructIcon, { type Position, type BoundingBox } from "./construct-icon";
import ConstructOverview from "./construct-overview";
import React, { useEffect } from "react";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { ActionPallette } from "./action-palette";

const mapImage = "/middleearth.jpg";

const initBoundingBox: BoundingBox = { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 };

export interface ViewTransformation {
  scale: number;
  translateX: number;
  translateY: number;
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
  const newPosX = scaledX + centerX + viewTransformation.translateX;
  const newPosY = scaledY + centerY + viewTransformation.translateY;

  return {
    posX: newPosX,
    posY: newPosY,
  };
}

export function translatePositionForStore(boundingBox: BoundingBox, viewTransformation: ViewTransformation, position: Position | undefined): Position {
  const centerX = boundingBox.width / 2;
  const centerY = boundingBox.top + (boundingBox.height / 2);

  // Translate the construct's position back to the center
  const translatedX = (position?.posX ?? 0) - centerX - viewTransformation.translateX;
  const translatedY = (position?.posY ?? 0) - centerY - viewTransformation.translateY;

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

function OverviewMap() {
  const [isOpen, setOpen] = React.useState(false);
  const [viewTransformation, setViewTransformation] = React.useState({scale: 100, translateX: 0, translateY: 0});
  const [boundingBox, setBoundingBox] = React.useState(initBoundingBox);
  const storeConstructs = useConstructContext((state) => state.constructs);
  const activeConstruct = useConstructContext((state) => state.activeConstruct);
  const translatedConstructs = useConstructContext((state) => state.constructs.map(construct => ({
    ...construct,
    ...translatePositionForView(boundingBox, viewTransformation, construct)
  })));


  useEffect(() => {
    console.log("OverviewMap re-rendered with constructs:", storeConstructs);
  }, [storeConstructs]);

  return (
    <>
      <div className="aspect-auto overflow-hidden relative h-[37vw]">
        <ActionPallette viewTransformation={viewTransformation} setViewTransformation={setViewTransformation}/>
        <Image
          className={`object-contain transform scale-${viewTransformation.scale} translate-x-${viewTransformation.translateX} translate-y-${viewTransformation.translateY}`}
          src={mapImage}
          alt="map"
          quality="100"
          fill
          onLoad={(e) =>{
            console.log("Image loaded", e.currentTarget.getBoundingClientRect());
            setBoundingBox(e.currentTarget.getBoundingClientRect())
          }
          }
        />
      </div>
      {activeConstruct && (
        <ConstructOverview isOpen={isOpen} setOpen={setOpen} />
      )}

      {boundingBox !== initBoundingBox &&
        translatedConstructs
          .filter((construct) => construct !== undefined &&
                                 construct.posX >= boundingBox.left &&
                                 construct.posX <= boundingBox.right &&
                                 construct.posY >= boundingBox.top &&
                                 construct.posY <= boundingBox.bottom)
          .map((construct) => (
          <ConstructIcon
            key={construct.id}
            setOpen={setOpen}
            constructId={construct.id}
            boundingBox={boundingBox}
            viewTransformation={viewTransformation}
          />
        ))}
    </>
  );
}

export default OverviewMap;
