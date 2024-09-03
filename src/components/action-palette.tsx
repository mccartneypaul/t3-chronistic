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
    <div className="absolute flex flex-col m-10 space-y-4 top-10 left-3">
      <ZoomIn viewTransformation={props.viewTransformation} setViewTransformation={props.setViewTransformation}/>
      <ZoomOut viewTransformation={props.viewTransformation} setViewTransformation={props.setViewTransformation}/>
      <AddConstructIcon/>
    </div>
    );
}