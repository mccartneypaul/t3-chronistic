import Image from "next/image";
import ConstructIcon, { type BoundingBox } from "./construct-icon";
import ConstructOverview from "./construct-overview";
import React, { useEffect } from "react";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { ActionPallette } from "./action-palette";

const mapImage = "/middleearth.jpg";

const initBoundingBox: BoundingBox = { top: 0, left: 0, bottom: 0, right: 0 };

function OverviewMap() {
  const [isOpen, setOpen] = React.useState(false);
  const [boundingBox, setBoundingBox] = React.useState(initBoundingBox);
  const constructs = useConstructContext((state) => state.constructs);
  const activeConstruct = useConstructContext((state) => state.activeConstruct);

  useEffect(() => {
    console.log("OverviewMap re-rendered with constructs:", constructs);
  }, [constructs]);

  return (
    <>
      <div className="aspect-auto relative h-[37vw]">
        <ActionPallette/>
        <Image
          className="object-contain"
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

      {boundingBox != initBoundingBox &&
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
