import { ZoomOut } from "./zoom-out";
import { AddConstructIcon } from "./add-construct-icon";
import { ZoomIn } from "./zoom-in";

export function ActionPallette() {
  return (
    <div className="flex flex-col m-10 space-y-4 top-1/2 left-20">
      <ZoomIn/>
      <ZoomOut/>
      <AddConstructIcon/>
    </div>
    );
}