import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Fab } from '@mui/material';
import type { ViewTransformationProps } from './action-palette';

export function ZoomIn(props: ViewTransformationProps) {
  const incrementZoom = () => {
    props.setViewTransformation((prev) => {
      if (prev.scale >= 300) {
        return {
          ...prev,
          scale: 300,
        };
      } else {
        return {
          ...prev,
          scale: prev.scale + 50,
        };
      }
    });
  }

  return (
    <>
      <Fab color="primary" aria-label="zoom in" onClick={incrementZoom}>
        <ZoomInIcon />
      </Fab>
    </>
  );

}