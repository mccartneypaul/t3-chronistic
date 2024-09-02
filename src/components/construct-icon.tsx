import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import React, { useState, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import AdbIcon from "@mui/icons-material/Adb";
import { IconButton } from "@mui/material";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { api } from "@chronistic/utils/api";
import { mapFromApi } from "@chronistic/stores/construct";
import { translatePositionForStore, translatePositionForView, type ViewTransformation } from "./overview-map";

export interface Position {
  posX: number;
  posY: number;
}

export interface BoundingBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

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
  const nodeRef = React.useRef(null); // To suppress the warning about the ref in strict mode
  const [tempPosition, setTempPosition] = useState({posX: 0, posY: 0});
  const thisConstruct = useConstructContext((state) => 
    state.constructs.find((c) => c.id === constructId)
  );
  const isDraggingRef = useRef(false);
  const setActiveConstruct = useConstructContext(
    (state) => state.setActiveConstruct
  );
  const setConstruct = useConstructContext((state) => state.setConstruct);
  const mutatePostition = api.construct.patchPosition.useMutation();

  useEffect(() => {
    if (thisConstruct) {
      const pos = translatePositionForView(boundingBox, viewTransformation, thisConstruct);
      setTempPosition(validatePositionInBoundingBox(pos));
    }
  }, [thisConstruct, boundingBox, viewTransformation]);

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

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    isDraggingRef.current = true;
    setTempPosition((prevPosition) => ({
      posX: prevPosition.posX + data.deltaX,
      posY: prevPosition.posY + data.deltaY,
    }));
  };

  const onStop = () => {
    if (!isDraggingRef.current) { return; }
    isDraggingRef.current = false;

    async function asyncMutate() {
      const storePosition = translatePositionForStore(boundingBox, viewTransformation, tempPosition);
      return await mutatePostition.mutateAsync({
        id: constructId,
        ...storePosition
      });
    }

    asyncMutate()
      .then((r) => {
        if (r) {
          setConstruct(constructId, mapFromApi(r));
        }
      })
      .catch(console.error);
  };

  return (
    <Draggable
      nodeRef={nodeRef} // To suppress the warning about the ref in strict mode
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