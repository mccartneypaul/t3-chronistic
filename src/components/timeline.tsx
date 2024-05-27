import * as React from 'react';
import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

const Timeline = () => {
  return (
    <div className="flex flex-col w-full box-border">
      <div className="flex justify-center w-full mb-0 box-border">
        <span className="text-2xl text-white font-bold w-8 tracking-wide mx-1">Day</span>
        <div className="flex-1 mx-12 max-w-full">
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
      <div className="flex justify-center w-full mb-0 box-border">
        <span className="text-2xl text-white font-bold w-8 tracking-wide mx-1">Time</span>
        <div className="flex-1 mx-12 max-w-full">
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
      <div className="flex justify-center w-full box-border">
        <span className="text-2xl text-white font-bold w-8 tracking-wide mx-1">Epoch</span>
        <div className="flex-1 mx-12 max-w-full">
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
