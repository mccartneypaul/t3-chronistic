import Draggable, { type DraggableData, type DraggableEvent } from "react-draggable";
import React, { useState, useRef, useEffect } from "react";
import type {Dispatch, SetStateAction} from "react";
import AdbIcon from '@mui/icons-material/Adb';
import { IconButton } from "@mui/material";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { api } from "../utils/api";
import { mapFromApi } from "@chronistic/stores/construct";

interface Position {
  x: number;
  y: number;
}

interface ConstructIconProps {
  initialPosition?: Position;
  setOpen: Dispatch<SetStateAction<boolean>>;
  constructId: string;
}

function ConstructIcon({ initialPosition = { x: 0, y: 0 }, setOpen, constructId}: ConstructIconProps) {
  const [tempPosition, setTempPosition] = useState(initialPosition);
  const isDraggingRef = useRef(false);
  const setActiveConstruct = useConstructContext((state) => state.setActiveConstruct)
  const setConstruct = useConstructContext((state) => state.setConstruct)
  const mutatePostition = api.construct.positionPatch.useMutation();

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
    console.log(`InitX: ${initialPosition.x}, InitY: ${initialPosition.y}, DeltaX: ${data.deltaX}, DeltaY:${data.deltaY}, LastX: ${data.lastX}, LastY:${data.lastY}`);
    setTempPosition({ x: tempPosition.x + data.deltaX, y: tempPosition.y + data.deltaY });
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };
  
  return (
    <Draggable onStop={onStop} onDrag={onDrag} position={{y: tempPosition.y, x: tempPosition.x}}>
      <div className="absolute">
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
