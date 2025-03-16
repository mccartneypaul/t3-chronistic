import Image from "next/image";
import ConstructIcon from "./construct-icon";
import ConstructOverview from "./construct-overview";
import React, { Suspense, useEffect } from "react";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { ActionPallette } from "./action-palette";
import { translatePositionForView} from "@chronistic/models/Position";
import { initBoundingBox } from "@chronistic/models/BoundingBox";
import Draggable, { type DraggableData, type DraggableEvent } from "react-draggable";

const mapImage = "/api/s3?file=middleearth.jpg";

export default function OverviewMap() {
  const nodeRef = React.useRef(null); // To suppress the warning about the ref in strict mode
  const s3ImageUrl = React.useRef("");
  const isDraggingRef = React.useRef(false);
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

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    isDraggingRef.current = true;
    
    setViewTransformation((prevViewTransformation) => {
      return {
        ...prevViewTransformation,
        translateX: prevViewTransformation.translateX + data.deltaX,
        translateY: prevViewTransformation.translateY + data.deltaY,
      };
    });
    console.log("Dragged", viewTransformation);
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <div className="overflow-hidden">
          <div className={`overflow-hidden aspect-auto relative h-[37vw] transform scale-${viewTransformation.scale}`}>
            <Draggable
              nodeRef={nodeRef} // To suppress the warning about the ref in strict mode
              onStop={onStop}
              onDrag={onDrag}
              scale={viewTransformation.scale / 100}
            >
              <Image
                className={`object-contain`}
                src={mapImage}
                priority
                alt="map"
                quality="100"
                ref={nodeRef}
                fill
                draggable={false} // Disable default drag behavior
                onLoad={(e) =>{
                  console.log("Image loaded", e.currentTarget.getBoundingClientRect());
                  setBoundingBox(e.currentTarget.getBoundingClientRect())
                }
                }
              />
            </Draggable>
          </div>
        </div>

        {activeConstruct && (
          <ConstructOverview isOpen={isOpen} setOpen={setOpen} />
        )}
        
        <ActionPallette viewTransformation={viewTransformation} setViewTransformation={setViewTransformation}/>
        
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
      </Suspense>
    </>
  );
}
