import * as React from "react";
import Slider from "@mui/material/Slider";
import { usePositionContext } from "@chronistic/providers/position-store-provider";
import dayjs from "dayjs";
import pluralize from "pluralize";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useEffect } from "react";

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
  const [timelineOffset, setTimelineOffset] = React.useState(0);
  const minTime = dayjs
    .duration(timelineOffset, timelineBaseUnits.unit)
    .asSeconds();
  const defaultMaxDuration = dayjs.duration(
    timelineOffset + 10 * timelineBaseUnits.increment,
    timelineBaseUnits.unit,
  );
  const maxTime = defaultMaxDuration.asSeconds();
  const timelinePosition = usePositionContext(
    (state) => state.timelinePosition,
  );
  const setTimelinePosition = usePositionContext(
    (state) => state.setTimelinePosition,
  );

  useEffect(() => {
    const timeInSeconds = timelinePosition.asSeconds();
    const baseUnitIncrementInSeconds = dayjs
      .duration(timelineBaseUnits.increment, timelineBaseUnits.unit)
      .asSeconds();
    if (timeInSeconds < minTime) {
      const offsetDelta = Math.ceil(
        Math.abs(minTime - timeInSeconds) / baseUnitIncrementInSeconds,
      );
      const newOffset = Math.max(timelineOffset - offsetDelta, 0);

      setTimelineOffset(newOffset);
    }
    if (timeInSeconds > maxTime) {
      const offsetDelta = Math.ceil(
        Math.max(timeInSeconds - maxTime, 0) / baseUnitIncrementInSeconds,
      );
      const newOffset = timelineOffset + offsetDelta;
      setTimelineOffset(newOffset);
    }
    setTempValue(timelinePosition.asSeconds());
  }, [
    timelinePosition,
    minTime,
    maxTime,
    timelineBaseUnits.increment,
    timelineBaseUnits.unit,
    timelineOffset,
  ]);

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
        .duration(
          timelineOffset + timelineBaseUnits.increment * index,
          timelineBaseUnits.unit,
        )
        .asSeconds();
      const unitNumber = timelineOffset + timelineBaseUnits.increment * index;
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

  const offsetTimeline = (amount: number) => {
    // Offset the timeline by a certain amount making sure it doesn't go below 0
    setTimelineOffset((prev) => {
      let newOffset = prev + amount;
      if (newOffset < 0) {
        newOffset = 0;
      }
      // Update the timeline position to reflect the new offset
      handleChange(
        {} as Event,
        dayjs.duration(newOffset, timelineBaseUnits.unit).asSeconds(),
      );
      return newOffset;
    });
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
            min={minTime}
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
        {/* ------------------ Timeline controls --------------- */}
        {/* --------Buttons for offsetting the timeline -------- */}
        <div className="grid grid-rows-2">
          <div className="flex justify-center">
            <Tooltip title="Offset by -1" placement="top-start">
              <Button
                color="primary"
                aria-label="zoom in"
                size="small"
                variant="outlined"
                onClick={() => offsetTimeline(-1)}
                sx={{ color: "white" }}
              >
                <KeyboardArrowLeftIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Offset by 1" placement="top-start">
              <Button
                color="primary"
                aria-label="zoom in"
                size="small"
                variant="outlined"
                onClick={() => offsetTimeline(1)}
                sx={{ color: "white" }}
              >
                <KeyboardArrowRightIcon />
              </Button>
            </Tooltip>
          </div>
          <div className="flex justify-center">
            <Tooltip title="Offset by -5" placement="left">
              <Button
                color="primary"
                aria-label="zoom in"
                size="small"
                variant="outlined"
                onClick={() => offsetTimeline(-5)}
                sx={{ color: "white" }}
              >
                <KeyboardDoubleArrowLeftIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Offset by 5" placement="right">
              <Button
                color="primary"
                aria-label="zoom in"
                size="small"
                variant="outlined"
                onClick={() => offsetTimeline(5)}
                sx={{ color: "white" }}
              >
                <KeyboardDoubleArrowRightIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
        {/* ------------- Zoom controls for the timeline ------------- */}
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
