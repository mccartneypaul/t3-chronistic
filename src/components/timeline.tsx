import * as React from "react";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "0°C",
  },
  {
    value: 20,
    label: "20°C",
  },
  {
    value: 37,
    label: "37°C",
  },
  {
    value: 100,
    label: "100°C",
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

const Timeline = () => {
  return (
    <div className="box-border flex w-full flex-col">
      <div className="mb-0 box-border flex w-full justify-center">
        <span className="mx-1 w-8 text-2xl font-bold tracking-wide text-white">
          Day
        </span>
        <div className="mx-12 max-w-full flex-1">
          <Slider
            aria-label="Always visible"
            defaultValue={80}
            getAriaValueText={valuetext}
            step={10}
            marks={marks}
            valueLabelDisplay="on"
          />
        </div>
      </div>
      <div className="mb-0 box-border flex w-full justify-center">
        <span className="mx-1 w-8 text-2xl font-bold tracking-wide text-white">
          Time
        </span>
        <div className="mx-12 max-w-full flex-1">
          <Slider
            aria-label="Always visible"
            defaultValue={80}
            getAriaValueText={valuetext}
            step={10}
            marks={marks}
            valueLabelDisplay="on"
          />
        </div>
      </div>
      <div className="box-border flex w-full justify-center">
        <span className="mx-1 w-8 text-2xl font-bold tracking-wide text-white">
          Epoch
        </span>
        <div className="mx-12 max-w-full flex-1">
          <Slider
            aria-label="Always visible"
            defaultValue={80}
            getAriaValueText={valuetext}
            step={10}
            marks={marks}
            valueLabelDisplay="on"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
