import Draggable, { type DraggableEvent } from "react-draggable";
import React, { useState, useRef } from "react";
import type {Dispatch, SetStateAction} from "react";
import AdbIcon from '@mui/icons-material/Adb';
import { IconButton } from "@mui/material";
import type { Construct } from "@prisma/client";

interface Position {
  x: number;
  y: number;
}

interface EventIconProps {
  initialPosition?: Position;
  setOpen: Dispatch<SetStateAction<boolean>>;
  construct: Construct;
  setConstruct: Dispatch<SetStateAction<Construct>>;
}

function EventIcon({ initialPosition = { x: 0, y: 0 }, setOpen, construct, setConstruct}: EventIconProps) {
  const [position, setPosition] = useState(initialPosition);
  const isDraggingRef = useRef(false);

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
            setConstruct(construct);
            setOpen(true);
          }
        }> 
          <AdbIcon />
        </IconButton>
      </div>
    </Draggable>
  );
}

export default EventIcon;
