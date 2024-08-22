import Draggable, { type DraggableData, type DraggableEvent } from "react-draggable";
import React, { useState, useRef, useEffect } from "react";
import type {Dispatch, SetStateAction} from "react";
import AdbIcon from '@mui/icons-material/Adb';
import { IconButton } from "@mui/material";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { api } from "@chronistic/utils/api";
import { mapFromApi } from "@chronistic/stores/construct";

interface Position {
  x: number;
  y: number;
}

export interface BoundingBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

interface ConstructIconProps {
  initialPosition?: Position;
  setOpen: Dispatch<SetStateAction<boolean>>;
  constructId: string;
  boundingBox: BoundingBox;
}

function ConstructIcon({ initialPosition = { x: 0, y: 0 }, setOpen, constructId, boundingBox}: ConstructIconProps) {
  const nodeRef = React.useRef(null); // To suppress the warning about the ref in strict mode
  const [tempPosition, setTempPosition] = useState(validatePositionInBoundingBox(initialPosition));
  const isDraggingRef = useRef(false);
  const setActiveConstruct = useConstructContext((state) => state.setActiveConstruct)
  const setConstruct = useConstructContext((state) => state.setConstruct)
  const mutatePostition = api.construct.positionPatch.useMutation();


  function validatePositionInBoundingBox(position: Position) {
    if (position.x < boundingBox.left) {
      position.x = boundingBox.left;
    }
    else if (position.x > boundingBox.right) {
      position.x = boundingBox.right;
    }
    if (position.y < boundingBox.top) {
      position.y = boundingBox.top;
    }
    else if (position.y > boundingBox.bottom) {
      position.y = boundingBox.bottom;
    }
    return position;
  }

  // Debounce the position update so that we don't send a request for every pixel moved
  useEffect(() => {
    async function asyncMutate() {
      return await mutatePostition.mutateAsync(
        {
          id: constructId,
          posX: tempPosition.x,
          posY: tempPosition.y
        });
    }

    const timeout = setTimeout(() => {
      asyncMutate().then(r => {if(r) {setConstruct(constructId, mapFromApi(r))}}).catch(console.error);
    }, 300);
  
    return () => clearTimeout(timeout);
    },
    [tempPosition]
  );

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    isDraggingRef.current = true;
    // console.log(`InitX: ${initialPosition.x}, InitY: ${initialPosition.y}, DeltaX: ${data.deltaX}, DeltaY:${data.deltaY}, LastX: ${data.lastX}, LastY:${data.lastY}`);
    setTempPosition({ x: tempPosition.x + data.deltaX, y: tempPosition.y + data.deltaY });
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };
  
  return (
    <Draggable
      nodeRef={nodeRef} // To suppress the warning about the ref in strict mode
      onStop={onStop}
      onDrag={onDrag}
      position={{y: tempPosition.y, x: tempPosition.x}}
      bounds={boundingBox}
    >
      <div ref={nodeRef} className="absolute">
        <IconButton
          color='secondary'
          onDoubleClick={() => {
            setActiveConstruct(constructId);
            setOpen(true);
          }
        }> 
          <AdbIcon />
        </IconButton>
      </div>
    </Draggable>
  );
}

export default ConstructIcon;
