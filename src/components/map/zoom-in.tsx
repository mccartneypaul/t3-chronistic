import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Fab from "@mui/material/Fab";
import type { ViewTransformationProps } from "./action-palette";

export function ZoomIn(props: ViewTransformationProps) {
  const incrementZoom = () => {
    props.setViewTransformation((prev) => {
      if (prev.scale >= 500) {
        return {
          ...prev,
          scale: 500,
        };
      } else {
        return {
          ...prev,
          scale: prev.scale + 50,
        };
      }
    });
  };

  return (
    <>
      <Fab color="primary" aria-label="zoom in" onClick={incrementZoom}>
        <ZoomInIcon />
      </Fab>
    </>
  );
}
