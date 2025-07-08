import Image from "next/image";
import ConstructIcon from "@chronistic/components/construct/construct-icon";
import ConstructOverview from "@chronistic/components/construct/construct-overview";
import React, { Suspense, useEffect } from "react";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { ActionPallette } from "@chronistic/components/map/action-palette";
import {
  translatePositionForTimeline,
  translatePositionForView,
} from "@chronistic/models/Position";
import { initBoundingBox } from "@chronistic/models/BoundingBox";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { api } from "@chronistic/utils/api";
import { usePositionContext } from "@chronistic/providers/position-store-provider";

export interface OverviewMapProps {
  mapUrl: string;
}

export default function OverviewMap(props: OverviewMapProps) {
  const { data: mapImage } = api.s3.getByKey.useQuery(props.mapUrl);
  const nodeRef = React.useRef<HTMLImageElement>(null); // To suppress the warning about the ref in strict mode
  const isDraggingRef = React.useRef(false);
  const [isOpen, setOpen] = React.useState(false);
  const [viewTransformation, setViewTransformation] = React.useState({
    scale: 100,
    translateX: 0,
    translateY: 0,
  });
  const [boundingBox, setBoundingBox] = React.useState(initBoundingBox);
  const storeConstructs = useConstructContext((state) => state.constructs);
  const activeConstruct = useConstructContext((state) => state.activeConstruct);
  const timelinePosition = usePositionContext(
    (state) => state.timelinePosition,
  );
  const allPositions = usePositionContext((state) => state.positions);
  const translatedConstructs = useConstructContext((state) =>
    state.constructs.map((construct) => ({
      ...construct,
      ...translatePositionForView(
        boundingBox,
        viewTransformation,
        translatePositionForTimeline(
          timelinePosition,
          allPositions.filter((p) => p.constructId === construct.id),
        ),
      ),
    })),
  );

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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -10 : 10;
    setViewTransformation((prev) => {
      if (prev.scale + delta >= 500) {
        return {
          ...prev,
          scale: 500,
        };
      } else if (prev.scale + delta <= 100) {
        return {
          ...prev,
          scale: 100,
        };
      } else {
        return {
          ...prev,
          scale: prev.scale + delta,
        };
      }
    });
  };

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <div className="overflow-hidden">
          <div
            className="relative aspect-auto h-[42vw] overflow-hidden"
            style={{ transform: `scale(${viewTransformation.scale / 100})` }}
            onWheel={handleWheel}
          >
            <Draggable
              nodeRef={nodeRef as React.RefObject<HTMLElement>} // To suppress the warning about the ref in strict mode
              onStop={onStop}
              onDrag={onDrag}
              scale={viewTransformation.scale / 100}
            >
              <Image
                className={`object-contain`}
                src={`data:${mapImage?.fileType};base64,${Buffer.from(mapImage?.u8Stream ?? []).toString("base64")}`}
                priority
                alt="Map image"
                quality="100"
                ref={nodeRef}
                fill
                draggable={false} // Disable default drag behavior
                onLoad={(e) => {
                  console.log(
                    "Image loaded",
                    e.currentTarget.getBoundingClientRect(),
                  );
                  setBoundingBox(e.currentTarget.getBoundingClientRect());
                }}
              />
            </Draggable>
          </div>
        </div>

        {activeConstruct && (
          <ConstructOverview isOpen={isOpen} setOpen={setOpen} />
        )}

        <ActionPallette
          viewTransformation={viewTransformation}
          setViewTransformation={setViewTransformation}
        />

        {boundingBox !== initBoundingBox &&
          translatedConstructs
            .filter(
              (construct) =>
                construct !== undefined &&
                // TODO: don't show the construct if the first position is after the current timeline position
                construct.posX >= boundingBox.left &&
                construct.posX <= boundingBox.right &&
                construct.posY >= boundingBox.top &&
                construct.posY <= boundingBox.bottom,
            )
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
