import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import React, { useState, useRef, useEffect, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import AdbIcon from "@mui/icons-material/Adb";
import IconButton from "@mui/material/IconButton";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { api } from "@chronistic/utils/api";
import { mapFromApi } from "@chronistic/stores/position";
import {
  translatePositionForStore,
  translatePositionForTimeline,
  translatePositionForView,
} from "@chronistic/models/Position";
import type { BoundingBox } from "@chronistic/models/BoundingBox";
import type { ViewTransformation } from "@chronistic/models/ViewTransformation";
import type { Position } from "@chronistic/models/Position";
import { usePositionContext } from "@chronistic/providers/position-store-provider";
import { useMapContext } from "@chronistic/providers/map-store-provider";

interface ConstructIconProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  constructId: string;
  boundingBox: BoundingBox;
  viewTransformation: ViewTransformation;
}

function ConstructIcon({
  setOpen,
  constructId,
  boundingBox,
  viewTransformation,
}: ConstructIconProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null); // To suppress the warning about the ref in strict mode
  const [tempPosition, setTempPosition] = useState({ posX: 0, posY: 0 });
  const thisConstruct = useConstructContext((state) =>
    state.constructs.find((c) => c.id === constructId),
  );
  const isDraggingRef = useRef(false);
  const setActiveConstruct = useConstructContext(
    (state) => state.setActiveConstruct,
  );
  const upsertPosition = api.position.upsertPosition.useMutation();
  const upsertStorePosition = usePositionContext(
    (state) => state.upsertPosition,
  );
  const timelinePosition = usePositionContext(
    (state) => state.timelinePosition,
  );
  const allPositions = usePositionContext((state) => state.positions);
  const constructPositions = useMemo(
    () => allPositions.filter((p) => p.constructId === constructId),
    [allPositions, constructId],
  );
  const activeMapId = useMapContext((state) => state.activeMapId);

  // Update the temp position whenever construct or view transformation changes
  useEffect(() => {
    if (!thisConstruct) {
      return;
    }

    // Ensure the position is within the bounding box for the view
    // So that we only save valid positions
    function validatePositionInBoundingBox(position: Position) {
      if (position.posX < boundingBox.left) {
        position.posX = boundingBox.left;
      } else if (position.posX > boundingBox.right) {
        position.posX = boundingBox.right;
      }
      if (position.posY < boundingBox.top) {
        position.posY = boundingBox.top;
      } else if (position.posY > boundingBox.bottom) {
        position.posY = boundingBox.bottom;
      }
      return position;
    }

    const timePos = translatePositionForTimeline(
      timelinePosition,
      constructPositions,
    );
    // console.log("Timeline position:", timelinePosition);
    // console.log("Construct positions:", constructPositions);
    // console.log("timePos:", timePos);
    // If there is no position for the current timeline
    if (!timePos) {
      return;
    }
    const pos = translatePositionForView(
      boundingBox,
      viewTransformation,
      timePos,
    );
    setTempPosition(validatePositionInBoundingBox(pos));
  }, [
    thisConstruct,
    boundingBox,
    viewTransformation,
    constructPositions,
    timelinePosition,
  ]);

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    isDraggingRef.current = true;
    setTempPosition((prevPosition) => ({
      posX: prevPosition.posX + data.deltaX,
      posY: prevPosition.posY + data.deltaY,
    }));
  };

  // Only mutate the position if the icon was dragged
  const onStop = () => {
    if (!isDraggingRef.current) {
      return;
    }
    isDraggingRef.current = false;

    async function asyncMutate() {
      if (!thisConstruct) {
        console.error(
          "Construct not found for construct icon with ID:",
          constructId,
        );
        return;
      }
      if (!activeMapId) {
        console.error(
          "Active map ID is not set when trying to upsert position for construct:",
          constructId,
        );
        return;
      }
      const storePosition = {
        data: {
          mapId: activeMapId,
          constructId: constructId,
          intervalFromBeginning: timelinePosition.toISOString(),
          ...translatePositionForStore(
            boundingBox,
            viewTransformation,
            tempPosition,
          ),
        },
      };
      console.log("Store position to upsert:", storePosition);
      return await upsertPosition.mutateAsync(storePosition);
    }

    asyncMutate()
      .then((r) => {
        if (r) {
          console.log("Position upserted:", r);
          upsertStorePosition(mapFromApi(r));
        }
      })
      .catch(console.error);
  };

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>} // To suppress the warning about the ref in strict mode
      onStop={onStop}
      onDrag={onDrag}
      position={{ y: tempPosition.posY, x: tempPosition.posX }}
      bounds={boundingBox}
    >
      <div ref={nodeRef} className="absolute">
        <IconButton
          color="secondary"
          onDoubleClick={() => {
            setActiveConstruct(constructId);
            setOpen(true);
          }}
        >
          <AdbIcon />
        </IconButton>
      </div>
    </Draggable>
  );
}

export default ConstructIcon;
