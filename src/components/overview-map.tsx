import Image from "next/image";
import ConstructIcon from "./construct-icon";
import ConstructOverview from "./construct-overview";
import React, { useEffect } from "react";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { ActionPallette } from "./action-palette";
import { translatePositionForView} from "@chronistic/models/Position";
import { initBoundingBox } from "@chronistic/models/BoundingBox";

const mapImage = "/middleearth.jpg";

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
