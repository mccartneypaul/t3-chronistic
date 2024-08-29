import { ZoomOut } from "./zoom-out";
import { AddConstructIcon } from "./add-construct-icon";
import { ZoomIn } from "./zoom-in";
import type { ViewTransformation } from "./overview-map";
import type { Dispatch, SetStateAction } from "react";

export interface ViewTransformationProps {
  viewTransformation: ViewTransformation;
  setViewTransformation: Dispatch<SetStateAction<ViewTransformation>>;
}

export function ActionPallette(props: ViewTransformationProps) {
  return (
    <div className="flex flex-col m-10 space-y-4 top-1/2 left-20">
      <ZoomIn viewTransformation={props.viewTransformation} setViewTransformation={props.setViewTransformation}/>
      <ZoomOut viewTransformation={props.viewTransformation} setViewTransformation={props.setViewTransformation}/>
      <AddConstructIcon/>
    </div>
    );
}