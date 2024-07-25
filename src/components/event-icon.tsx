import Draggable, { type DraggableEvent } from "react-draggable";
import React, { useState, useRef } from "react";
import type {Dispatch, SetStateAction} from "react";
import AdbIcon from '@mui/icons-material/Adb';
import { IconButton } from "@mui/material";

interface Position {
  x: number;
  y: number;
}

interface EventIconProps {
  initialPosition?: Position;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function EventIcon({ initialPosition = { x: 0, y: 0 }, setOpen}: EventIconProps) {
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
        <IconButton color='secondary' onDoubleClick={() => setOpen(true)}> 
          <AdbIcon />
        </IconButton>
      </div>
    </Draggable>
  );
}

export default EventIcon;
