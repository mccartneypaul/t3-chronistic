import * as React from "react";
import Slider from "@mui/material/Slider";
import { usePositionContext } from "@chronistic/providers/position-store-provider";
import dayjs from "dayjs";
import pluralize from "pluralize";
import { Button, Tooltip } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

export interface TimelineBaseUnits {
  increment: number;
  unit: plugin.DurationUnitType;
}

function valuetext(value: number) {
  return dayjs.duration(value, "seconds").humanize();
}

function updateTimelineBaseUnits(
  delta: number,
  currentBaseUnits: TimelineBaseUnits,
): TimelineBaseUnits {
  const defaultBaseUnits: TimelineBaseUnits = {
    increment: 1,
    unit: "days",
  };
  // Create an array of sensible base units ranging from hours to years
  const baseUnits: TimelineBaseUnits[] = [
    { increment: 1, unit: "hours" },
    { increment: 3, unit: "hours" },
    { increment: 6, unit: "hours" },
    { increment: 12, unit: "hours" },
    defaultBaseUnits,
    { increment: 3, unit: "days" },
    { increment: 7, unit: "days" },
    { increment: 14, unit: "days" },
    { increment: 1, unit: "months" },
    { increment: 3, unit: "months" },
    { increment: 6, unit: "months" },
    { increment: 1, unit: "years" },
    { increment: 5, unit: "years" },
    { increment: 10, unit: "years" },
  ];
  // Get all of the TimelineBaseUnits that share the same unit as the current one
  // Then order them by which is closest to the current increment
  // Then take the first one
  const currentUnitBaseUnits = baseUnits
    .filter((unit) => unit.unit === currentBaseUnits.unit)
    .sort(
      (a, b) =>
        Math.abs(a.increment - currentBaseUnits.increment) -
        Math.abs(b.increment - currentBaseUnits.increment),
    );

  const newBaseUnits =
    currentUnitBaseUnits.length > 0 && currentUnitBaseUnits[0]
      ? currentUnitBaseUnits[0]
      : defaultBaseUnits;
  const currentIndex = baseUnits.findIndex(
    (unit) =>
      unit.increment === newBaseUnits.increment &&
      unit.unit === newBaseUnits.unit,
  );
  // If the delta is positive, we want to increase the increment
  // If the delta is negative, we want to decrease the increment
  let nextBaseUnit: TimelineBaseUnits | undefined;
  if (delta > 0 && currentIndex + 1 < baseUnits.length) {
    nextBaseUnit = baseUnits[currentIndex + 1];
  } else if (delta < 0 && currentIndex - 1 >= 0) {
    nextBaseUnit = baseUnits[currentIndex - 1];
  } else {
    nextBaseUnit = baseUnits[currentIndex];
  }

  if (!nextBaseUnit) {
    return defaultBaseUnits;
  }

  return nextBaseUnit;
}

export default function Timeline() {
  const majorTickLabel = (value: number, unit: plugin.DurationUnitType) => {
    return `${value} ${pluralize(unit, value)}`;
  };

  const [tempValue, setTempValue] = React.useState(0);
  const [timelineBaseUnits, setTimelineBaseUnits] =
    React.useState<TimelineBaseUnits>({
      increment: 1,
      unit: "days",
    });
  const defaultMaxDuration = dayjs.duration(
    10 * timelineBaseUnits.increment,
    timelineBaseUnits.unit,
  );
  const maxTime = defaultMaxDuration.asSeconds();
  const setTimelinePosition = usePositionContext(
    (state) => state.setTimelinePosition,
  );

  // Generate marks based on the units you'd like
  const marks = Array.from(
    {
      length:
        Math.ceil(
          maxTime /
            dayjs
              .duration(timelineBaseUnits.increment, timelineBaseUnits.unit)
              .asSeconds(),
        ) + 1,
    },
    (_, index) => {
      const value = dayjs
        .duration(timelineBaseUnits.increment * index, timelineBaseUnits.unit)
        .asSeconds();
      const unitNumber = timelineBaseUnits.increment * index;
      return {
        value: value,
        label: majorTickLabel(unitNumber, timelineBaseUnits.unit),
      };
    },
  );

  const handleChange = (event: Event, newValue: number) => {
    setTempValue(newValue as number);
    setTimelinePosition(dayjs.duration(newValue, "seconds"));
  };

  const formatValueLabel = (value: number) => {
    return dayjs.duration(value, "seconds").format("HH:mm:ss Y-M-D");
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setTimelineBaseUnits(updateTimelineBaseUnits(e.deltaY, timelineBaseUnits));
  };

  const widenTimeline = () => {
    setTimelineBaseUnits((prev) => updateTimelineBaseUnits(-1, prev));
  };
  const narrowTimeline = () => {
    setTimelineBaseUnits((prev) => updateTimelineBaseUnits(1, prev));
  };

  return (
    <div className="box-border flex w-full flex-col bg-blue-400">
      <div className="mb-0 box-border flex w-full justify-center">
        <div className="mx-12 max-w-full flex-1" onWheel={handleWheel}>
          <Slider
            aria-label="Always visible"
            defaultValue={0}
            value={tempValue}
            getAriaValueText={valuetext}
            onChange={handleChange}
            step={10}
            marks={marks}
            max={maxTime}
            valueLabelDisplay="on"
            valueLabelFormat={formatValueLabel}
            sx={{
              "& .MuiSlider-markLabel": {
                color: "lightgray",
              },
              "& .MuiSlider-markLabelActive": {
                color: "white",
              },
            }}
          />
        </div>
        <div className="grid grid-rows-2">
          <Tooltip title="Narrow timeline scope" placement="top-start">
            <Button
              color="primary"
              aria-label="zoom in"
              size="small"
              variant="outlined"
              onClick={widenTimeline}
              sx={{ color: "white" }}
            >
              <ZoomInIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Widen timeline scope" placement="left-start">
            <Button
              color="primary"
              aria-label="zoom out"
              size="small"
              variant="outlined"
              onClick={narrowTimeline}
              sx={{ color: "white" }}
            >
              <ZoomOutIcon />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
