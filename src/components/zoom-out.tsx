import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Fab } from '@mui/material';
import type { ViewTransformationProps } from './action-palette';

export function ZoomOut(props: ViewTransformationProps) {
  const decrementZoom = () => {
    props.setViewTransformation((prev) => {
      if (prev.scale <= 100) {
        return {
          ...prev,
          scale: 100,
        };
      } else {
        return {
          ...prev,
          scale: prev.scale - 50,
        };
      }
    });
  }

  return (
    <>
      <Fab color="primary" aria-label="zoom out" onClick={decrementZoom}>
        <ZoomOutIcon />
      </Fab>
    </>
  );

}