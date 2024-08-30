import Image from "next/image";
import ConstructIcon, { type BoundingBox } from "./construct-icon";
import ConstructOverview from "./construct-overview";
import React, { useEffect } from "react";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { ActionPallette } from "./action-palette";

const mapImage = "/middleearth.jpg";

const initBoundingBox: BoundingBox = { top: 0, left: 0, bottom: 0, right: 0 };

export interface ViewTransformation {
  scale: number;
  translateX: number;
  translateY: number;
}

function OverviewMap() {
  const [isOpen, setOpen] = React.useState(false);
  const [viewTransformation, setViewTransformation] = React.useState({scale: 100, translateX: 0, translateY: 0});
  const [boundingBox, setBoundingBox] = React.useState(initBoundingBox);
  const constructs = useConstructContext((state) => state.constructs);
  const activeConstruct = useConstructContext((state) => state.activeConstruct);

  useEffect(() => {
    console.log("OverviewMap re-rendered with constructs:", constructs);
  }, [constructs]);

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
          onLoad={(e) =>
            setBoundingBox(e.currentTarget.getBoundingClientRect())
          }
        />
      </div>
      {activeConstruct && (
        <ConstructOverview isOpen={isOpen} setOpen={setOpen} />
      )}

      {boundingBox !== initBoundingBox &&
        constructs.map((construct) => (
          <ConstructIcon
            key={construct.id}
            initialPosition={{ x: construct.posX, y: construct.posY }}
            setOpen={setOpen}
            constructId={construct.id}
            boundingBox={boundingBox}
          />
        ))}
    </>
  );
}

export default OverviewMap;
