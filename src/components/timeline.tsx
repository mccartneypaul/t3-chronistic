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
    return <>
        <div>
            <span className="flex items-center">
                <span className="text-lg font-medium not-italic tracking-wide mr-1 ml-1">Day</span>
                <Slider
                    aria-label="Always visible"
                    defaultValue={80}
                    getAriaValueText={valuetext}
                    step={10}
                    marks={marks}
                    valueLabelDisplay="on"
                />
            </span>
            <span className="flex items-center">
                <span className="text-lg font-medium not-italic tracking-wide mr-1 ml-1">Time</span>
                <Slider
                    aria-label="Always visible"
                    defaultValue={80}
                    getAriaValueText={valuetext}
                    step={10}
                    marks={marks}
                    valueLabelDisplay="on"
                />
            </span>
            <span className="flex items-center">
                <span className="text-lg font-medium not-italic tracking-wide mr-1 ml-1">Epoch</span>
                <Slider
                    aria-label="Always visible"
                    defaultValue={80}
                    getAriaValueText={valuetext}
                    step={10}
                    marks={marks}
                    valueLabelDisplay="on"
                />
            </span>
        </div>
    </>;
};

export default Timeline;
