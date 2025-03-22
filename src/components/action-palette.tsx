import { ZoomOut } from "./zoom-out";
import { AddConstructIcon } from "./add-construct-icon";
import { ZoomIn } from "./zoom-in";
import type { Dispatch, SetStateAction } from "react";
import type { ViewTransformation } from "@chronistic/models/ViewTransformation";

export interface ViewTransformationProps {
  viewTransformation: ViewTransformation;
  setViewTransformation: Dispatch<SetStateAction<ViewTransformation>>;
}

export function ActionPallette(props: ViewTransformationProps) {
  return (
    <div className="absolute left-3 top-10 m-10 flex flex-col space-y-4">
      <ZoomIn
        viewTransformation={props.viewTransformation}
        setViewTransformation={props.setViewTransformation}
      />
      <ZoomOut
        viewTransformation={props.viewTransformation}
        setViewTransformation={props.setViewTransformation}
      />
      <AddConstructIcon />
    </div>
  );
}
