import Draggable, { type DraggableEvent } from "react-draggable";
import React, { useState, useRef } from "react";
import type {Dispatch, SetStateAction} from "react";
import AdbIcon from '@mui/icons-material/Adb';
import { IconButton } from "@mui/material";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";

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
  const [position, setPosition] = useState(initialPosition);
  const isDraggingRef = useRef(false);
  const { setActiveConstruct } = useConstructContext(
    (state) => state,
  )

  const onDrag = (e: DraggableEvent, data: Position) => {
    isDraggingRef.current = true;
    setPosition({ x: data.x, y: data.y });
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };
  
  return (
    <Draggable onStop={onStop} onDrag={onDrag}>
      <div className="absolute" style={{top: `${initialPosition.x}px`, left: `${initialPosition.y}px`}}>
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
