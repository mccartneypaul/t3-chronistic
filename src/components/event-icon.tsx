import Draggable, { type DraggableEvent } from "react-draggable";
import React, { useState, useRef } from "react";
import AdbIcon from '@mui/icons-material/Adb';
import { useModal } from '../contexts/modal-context';

interface Position {
  x: number;
  y: number;
}

interface EventIconProps {
  initialPosition?: Position;
}

function EventIcon({ initialPosition = { x: 0, y: 0 }}: EventIconProps) {
  const [position, setPosition] = useState(initialPosition);
  const isDraggingRef = useRef(false);
  const { openModal } = useModal();

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
        <button onClick={openModal}>
          <AdbIcon />
        </button>
      </div>
    </Draggable>
  );
}

export default EventIcon;
